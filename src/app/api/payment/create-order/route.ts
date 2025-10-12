import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { razorpay, EXTRA_SUBDOMAIN_PRICE, TransactionService } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subdomainSlots } = await request.json()
    
    if (!subdomainSlots || subdomainSlots < 1) {
      return NextResponse.json({ error: 'Invalid subdomain slots' }, { status: 400 })
    }

    const amount = subdomainSlots * EXTRA_SUBDOMAIN_PRICE * 100 // Convert to paise
    
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.email || '',
        subdomainSlots: subdomainSlots.toString(),
      },
    })

    // Create transaction record with async service
    const transaction = await TransactionService.createTransaction({
      userId: session.user.email || '',
      userEmail: session.user.email || '',
      userName: session.user.name || '',
      orderId: order.id,
      paymentId: '',
      amount: amount / 100, // Store in rupees
      currency: 'INR',
      subdomainSlots,
      status: 'created',
    })

    console.log('Order created:', order.id, 'Transaction created:', transaction.id)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      transactionId: transaction.id,
    })
  } catch (error) {
    console.error('Error creating payment order:', error)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}