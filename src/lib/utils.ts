import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { UserStorage } from './storage'
import { TransactionService } from './razorpay'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price)
}

export function generateSubdomain(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Get the effective subdomain limit for a user (base limit + purchased slots)
 */
export async function getEffectiveSubdomainLimit(userId: string, userEmail?: string): Promise<number> {
  try {
    // Get user data from database.json
    const user = await UserStorage.findById(userId)
    if (!user) {
      return 2 // Default limit if user not found
    }

    const baseLimit = user.subdomainLimit || 2

    // Get purchased slots from transactions.json
    const identifier = userEmail || userId
    const purchasedSlots = await TransactionService.getUserSubdomainLimit(identifier)
    
    // If TransactionService returns a total limit, we need to extract only the purchased part
    // Since TransactionService.getUserSubdomainLimit returns total (default 2 + purchased)
    // We need to subtract the default to get only purchased slots
    const additionalSlots = Math.max(0, purchasedSlots - 2)
    
    return baseLimit + additionalSlots
  } catch (error) {
    console.error('Error getting effective subdomain limit:', error)
    return 2 // Default fallback
  }
}

/**
 * Update both base limit and maintain purchased slots
 */
export async function setEffectiveSubdomainLimit(userId: string, newTotalLimit: number, userEmail?: string): Promise<void> {
  try {
    const user = await UserStorage.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Get current purchased slots
    const identifier = userEmail || userId
    const currentPurchasedSlots = Math.max(0, (await TransactionService.getUserSubdomainLimit(identifier)) - 2)
    
    // Calculate what the new base limit should be
    const newBaseLimit = Math.max(2, newTotalLimit - currentPurchasedSlots)
    
    // Update base limit in database.json
    await UserStorage.update(userId, { subdomainLimit: newBaseLimit })
    
    // If admin is setting a limit lower than purchased slots, we need to handle this
    if (newTotalLimit < currentPurchasedSlots + 2) {
      // Set transactions.json to maintain the desired total
      await TransactionService.setUserSubdomainLimit(identifier, newTotalLimit)
    }
  } catch (error) {
    console.error('Error setting effective subdomain limit:', error)
    throw error
  }
}