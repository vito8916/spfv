import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getAuthUser} from "@/app/actions/auth";
import {getActiveSubscription} from "@/app/actions/subscriptions";
import {Suspense} from "react";
import {Users, CreditCard, AlertCircle, Clock, Check, LineChart, FileText, BarChart, Calendar, XCircle} from "lucide-react";
import {formatDate} from "@/utils/utils";
import {redirect} from "next/navigation";
import {User} from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton";


// Get product name from price ID
function getProductName(priceId?: string): string {
    // Map of price IDs to product names
    const productMap: Record<string, string> = {
        'price_basic': 'Basic Plan',
        'price_pro': 'Professional Plan',
        'price_enterprise': 'Enterprise Plan',
        'price_starter': 'Starter Plan',
        'price_premium': 'Premium Plan',
    };
    
    // Default to showing a friendly name if the price ID isn't mapped
    // You can extend this map with actual price IDs from your system
    if (!priceId) return 'No Plan';
    
    return productMap[priceId] || 'Custom Plan';
}

// Subscription status badge component
function SubscriptionBadge({ status }: { status: string | undefined }) {
    if (!status) return <Badge variant="outline">No Subscription</Badge>;
    
    switch(status) {
        case 'active':
            return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"><Check className="mr-1 h-3 w-3" /> Active</Badge>;
        case 'trialing':
            return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"><Clock className="mr-1 h-3 w-3" /> Trial</Badge>;
        case 'past_due':
        case 'unpaid':
            return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20"><AlertCircle className="mr-1 h-3 w-3" /> Payment Issue</Badge>;
        case 'canceled':
        case 'incomplete':
        case 'incomplete_expired':
            return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"><XCircle className="mr-1 h-3 w-3" /> Inactive</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

// Dashboard content component
async function DashboardContent({user}: { user: User }) {

    // Get subscription data
    const {subscription} = await getActiveSubscription(user.id);
    const isUnsubscribed = subscription?.cancel_at_period_end === true;
    
    // Check if subscription is still in active period even if canceled
    const currentDate = new Date();
    const periodEndDate = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
    const isWithinActivePeriod = periodEndDate ? currentDate < periodEndDate : false;
    
    // User has access if subscription is active or within active period even if unsubscribed
    const hasAccess = subscription?.status === 'active' && isWithinActivePeriod;

    return (
        <>
            {/* Stats Cards */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Card className="border overflow-hidden shadow hover:shadow-md transition-all duration-300">
                    {hasAccess ? (
                        <div className="absolute h-1 inset-x-0 top-0 bg-green-500"></div>
                    ) : (
                        <div className="absolute h-1 inset-x-0 top-0 bg-red-500"></div>
                    )}
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                        <div className="rounded-full bg-primary/10 p-1.5">
                            <Users className="h-4 w-4 text-primary"/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="text-2xl font-bold">
                                <SubscriptionBadge status={subscription?.status} />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border shadow hover:shadow-md transition-all duration-300">
                    {isUnsubscribed ? (
                        <div className="absolute h-1 inset-x-0 top-0 bg-amber-500"></div>
                    ) : hasAccess ? (
                        <div className="absolute h-1 inset-x-0 top-0 bg-green-500"></div>
                    ) : (
                        <div className="absolute h-1 inset-x-0 top-0 bg-gray-300 dark:bg-gray-700"></div>
                    )}
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
                        <div className="rounded-full bg-primary/10 p-1.5">
                            <CreditCard className="h-4 w-4 text-primary"/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold mb-1 flex flex-wrap items-center gap-2">
                            {subscription ? getProductName(subscription.price_id) : 'No Active Plan'}
                            {isUnsubscribed && (
                                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Unsubscribed
                                </Badge>
                            )}
                        </div>
                        {subscription ? (
                            <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {isUnsubscribed ? 'Ends' : 'Renews'} {formatDate(subscription.current_period_end)}
                                    </span>
                                </div>
                                {isUnsubscribed && isWithinActivePeriod && (
                                    <div className="mt-2 text-xs px-2 py-1 bg-amber-500/10 text-amber-600 rounded-sm">
                                        Your subscription will not renew automatically, but you still have access until {formatDate(subscription.current_period_end)}
                                    </div>
                                )}
                                {isUnsubscribed && !isWithinActivePeriod && (
                                    <div className="mt-2 text-xs px-2 py-1 bg-amber-500/10 text-amber-600 rounded-sm">
                                        Your subscription will not renew automatically
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                <span className="text-primary hover:underline cursor-pointer">
                                    Upgrade to access Fair Value tools
                                </span>
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border bg-card text-card-foreground shadow hover:shadow-md transition-all duration-300">
                    {hasAccess ? (
                        <div className="absolute h-1 inset-x-0 top-0 bg-primary"></div>
                    ) : (
                        <div className="absolute h-1 inset-x-0 top-0 bg-gray-300 dark:bg-gray-700"></div>
                    )}
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Fair Value Analytics</CardTitle>
                        <div className="rounded-full bg-primary/10 p-1.5">
                            <BarChart className="h-4 w-4 text-primary"/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold mb-1">
                            {hasAccess ? 'Available' : 'Locked'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {hasAccess
                                ? (isUnsubscribed ? 'Access until ' + formatDate(subscription?.current_period_end) : 'Full access to analytics suite')
                                : 'Subscribe to unlock Fair Value analytics'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Unsubscribe Alert - only show when unsubscribed */}
            {isUnsubscribed && isWithinActivePeriod && (
                <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-amber-800 dark:text-amber-400">Your subscription is ending soon</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                                Your {getProductName(subscription?.price_id)} will end on {formatDate(subscription?.current_period_end)}. 
                                You still have full access to all features until this date. After this date, you&apos;ll lose access to Fair Value analytics and tools.
                            </p>
                            <button className="mt-3 bg-amber-600 text-white hover:bg-amber-700 rounded px-3 py-1.5 text-sm font-medium">
                                Renew Subscription
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fair Value Overview */}
            <Card className="border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Fair Value Overview</CardTitle>
                            <CardDescription>
                                Your portfolio and market value analysis
                            </CardDescription>
                        </div>
                        {!hasAccess ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-300">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Subscription Required
                            </Badge>
                        ) : isUnsubscribed ? (
                            <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
                                <Clock className="mr-1 h-3 w-3" /> 
                                Access until {formatDate(subscription?.current_period_end)}
                            </Badge>
                        ) : (
                            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                                <Check className="mr-1 h-3 w-3" /> 
                                Active
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {hasAccess ? (
                        <div className="h-[300px] w-full flex items-center justify-center bg-secondary/5 rounded-md border border-dashed">
                            <div className="text-center">
                                <LineChart className="h-8 w-8 mx-auto mb-2 text-primary/60" />
                                <p className="text-sm text-muted-foreground">Fair Value analytics visualization will appear here</p>
                                {isUnsubscribed && (
                                    <p className="text-xs text-amber-600 mt-2">Access ends on {formatDate(subscription?.current_period_end)}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[300px] w-full flex items-center justify-center bg-secondary/5 rounded-md border border-dashed">
                            <div className="text-center max-w-md px-4">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                                <h3 className="text-md font-medium mb-1">Subscription Required</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {isUnsubscribed 
                                        ? 'Your subscription has ended. Renew now to regain access to Fair Value analytics.'
                                        : 'Upgrade your account to access Fair Value analytics and portfolio tracking features.'}
                                </p>
                                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                                    {isUnsubscribed ? 'Renew Now' : 'Upgrade Now'}
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Activity Card */}
                <Card className="border overflow-hidden shadow hover:shadow-md transition-all duration-300">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your recent Fair Value activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasAccess ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Analysis generated</p>
                                        <p className="text-xs text-muted-foreground">
                                            Sample report generated successfully
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date().toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-center text-sm text-muted-foreground py-2">
                                    No more activities to display
                                </div>
                                {isUnsubscribed && (
                                    <div className="text-xs text-amber-600 text-center">
                                        Activity tracking available until {formatDate(subscription?.current_period_end)}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[200px]">
                                <p className="text-sm text-muted-foreground">
                                    {isUnsubscribed ? 'Renew subscription to continue tracking activities' : 'Upgrade to view your activity'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Account Information Card */}
                <Card className="border overflow-hidden shadow hover:shadow-md transition-all duration-300">
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                            Your account profile and settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Name</p>
                            <p className="text-sm text-muted-foreground">{user.user_metadata.full_name || 'Not set'}</p>
                        </div>
                        <div className="pt-2">
                            <button className="text-primary text-sm hover:underline inline-flex items-center gap-1">
                                Edit Profile
                                <ChevronRight className="h-3 w-3" />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const DashboardPage = async () => {
    // Get user data using the established pattern in your app
    const user = await getAuthUser();

    if (!user) {
        redirect("/sign-in")
    }

    return (
        <div className="container mx-auto py-10 px-4 flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Fair Value Dashboard</h1>
                    <Link href="/spfv">
                        <button className="text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md font-medium">
                            Launch Fair Value Tool
                        </button>
                    </Link>
                </div>
                <p className="text-muted-foreground">
                    Welcome back, {user.user_metadata.full_name || 'User'}
                </p>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<DashboardSkeleton/>}>
                <DashboardContent user={user}/>
            </Suspense>
        </div>
    );
};

export default DashboardPage;
