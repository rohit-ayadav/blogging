import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

const SystemSettings = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Manage global system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" placeholder="Enter site name" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input id="admin-email" type="email" placeholder="admin@example.com" />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="maintenance-mode" />
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="user-registration" />
                    <Label htmlFor="user-registration">Allow User Registration</Label>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="max-upload-size">Max Upload Size (MB)</Label>
                    <Input id="max-upload-size" type="number" placeholder="5" />
                </div>
                <Button>Save Settings</Button>
            </CardContent>
        </Card>
    )
}

export default SystemSettings