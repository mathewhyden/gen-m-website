import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const expenses = await db.getExpenses();
    const stats = await db.getAdminStats();
    return NextResponse.json({
      success: true,
      expenses,
      monthlyExpenses: stats.monthlyExpenses,
      totalExpenses: stats.totalExpenses,
      currentMonthName: stats.currentMonthName,
    });
  } catch (error) {
    console.error('Failed to get expenses:', error);
    return NextResponse.json({ success: false, error: 'Failed to get expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, amount, date, paymentMethod, notes } = body;

    if (!title || !category || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, category, and a positive amount in Rupees are required' 
      }, { status: 400 });
    }

    const newExpense = await db.createExpense({
      title: title.trim(),
      category: category.trim(),
      amount: Math.round(amount),
      date: date || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod?.trim() || 'UPI',
      notes: notes?.trim() || '',
    });

    const stats = await db.getAdminStats();

    return NextResponse.json({
      success: true,
      expense: newExpense,
      monthlyExpenses: stats.monthlyExpenses,
      totalExpenses: stats.totalExpenses,
    });
  } catch (error) {
    console.error('Failed to create expense:', error);
    return NextResponse.json({ success: false, error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Expense ID is required' }, { status: 400 });
    }

    const deleted = await db.deleteExpense(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    const stats = await db.getAdminStats();

    return NextResponse.json({
      success: true,
      monthlyExpenses: stats.monthlyExpenses,
      totalExpenses: stats.totalExpenses,
    });
  } catch (error) {
    console.error('Failed to delete expense:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete expense' }, { status: 500 });
  }
}
