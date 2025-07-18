
import type { LoginLocation } from "@/services/location-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface LoginHistoryCardProps {
    loginHistory: LoginLocation[];
}

// A simple function to determine if a login is from a new location.
// In a real app, this would involve more sophisticated checks against known locations.
const isNewLocation = (current: LoginLocation, history: LoginLocation[], index: number) => {
    if (index === history.length - 1) return false; // The very first login isn't "new"
    if (index === 0) return true; // The very latest login could be new
    const previousLogin = history[index + 1];
    if (!previousLogin) return false;

    const latDiff = Math.abs(current.latitude - previousLogin.latitude);
    const lonDiff = Math.abs(current.longitude - previousLogin.longitude);
    
    // A simple threshold to detect a significant location change (approx > 1km)
    return latDiff > 0.01 || lonDiff > 0.01;
}


export function LoginHistoryCard({ loginHistory }: LoginHistoryCardProps) {

    const recentHistory = loginHistory.slice(0, 5); // Show the 5 most recent logins

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Login Activity</CardTitle>
                <CardDescription>
                    Here are the most recent sign-ins to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Clock className="inline-block mr-2 h-4 w-4" />Date & Time</TableHead>
                            <TableHead><MapPin className="inline-block mr-2 h-4 w-4" />Location (Lat, Long)</TableHead>
                            <TableHead className="text-right">Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentHistory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">
                                    No login history found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            recentHistory.map((login, index) => (
                                <TableRow key={login.timestamp}>
                                    <TableCell className="font-medium">
                                        {format(new Date(login.timestamp), "PPP 'at' p")}
                                    </TableCell>
                                    <TableCell>
                                        <Link 
                                            href={`https://www.google.com/maps/search/?api=1&query=${login.latitude},${login.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary underline hover:no-underline"
                                        >
                                            {login.latitude.toFixed(4)}, {login.longitude.toFixed(4)}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {isNewLocation(login, loginHistory, index) && <Badge variant="destructive">New Location</Badge>}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
