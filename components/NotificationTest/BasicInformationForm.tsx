import React from 'react';
import { Bell, Image as ImageIcon, AlertCircle, Info, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NotificationPayload, GlobalStatistics } from '@/types/notification-types';

const BasicInformation = ({ notification, onChange }: {
    notification: NotificationPayload;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
                type="text"
                name="title"
                value={notification.title}
                onChange={onChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Notification Title"
            />
        </div>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Message *</label>
            <textarea
                name="message"
                value={notification.message}
                onChange={onChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Notification Message"
            />
        </div>
    </div>
);


// Statistics Component
const StatisticsPanel = ({ statistics }: { statistics: GlobalStatistics }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mt-2">
        <div className="flex items-center gap-1 bg-gray-50 p-2 rounded">
            <Info className="h-4 w-4" />
            <span>Active: {statistics.activeSubscriptions}</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 p-2 rounded">
            <Info className="h-4 w-4" />
            <span>Success: {(statistics.averageSuccessRate * 100).toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 p-2 rounded">
            <Info className="h-4 w-4" />
            <span>Total: {statistics.totalSuccesses + statistics.totalFailures}</span>
        </div>
    </div>
);

// Media Section
const MediaSection = ({ notification, onChange }: {
    notification: NotificationPayload;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700">
            <ImageIcon className="h-5 w-5" />
            Media
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                    type="url"
                    name="image"
                    value={notification.image}
                    onChange={onChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Icon URL</label>
                <input
                    type="url"
                    name="icon"
                    value={notification.icon}
                    onChange={onChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/icon.png"
                />
            </div>
        </div>
    </div>
);

const AdvancedOptions = ({ notification, onChange }: {
    notification: NotificationPayload;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => (
    <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700">
            <AlertCircle className="h-5 w-5" />
            Advanced Options
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Urgency</label>
                <select
                    name="urgency"
                    value={notification.urgency}
                    onChange={onChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="very-low">Very Low</option>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Topic</label>
                <input
                    type="text"
                    name="topic"
                    value={notification.topic}
                    onChange={onChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Notification topic"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">TTL (seconds)</label>
                <input
                    type="number"
                    name="ttl"
                    value={notification.ttl}
                    onChange={onChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tag</label>
                <input
                    type="text"
                    name="tag"
                    value={notification.tag}
                    onChange={onChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Notification tag"
                />
            </div>
        </div>
    </div>
);

// Options Section
const OptionsSection = ({ notification, onChange }: {
    notification: NotificationPayload;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700">
            <AlertCircle className="h-5 w-5" />
            Options
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['vibrate', 'requireInteraction', 'renotify', 'silent'] as (keyof NotificationPayload)[]).map((option) => (
                <div key={option} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id={option}
                        name={option}
                        checked={notification[option] as boolean}
                        onChange={onChange}
                        className="rounded text-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor={option} className="text-sm text-gray-700 capitalize">
                        {option}
                    </label>
                </div>
            ))}
        </div>
    </div>
);

// Status Display
const StatusDisplay = ({ status, error }: { status: string; error: string }) => (
    <>
        {status && (
            <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm overflow-x-auto text-gray-700">
                    {status}
                </pre>
            </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
    </>
);

export { BasicInformation, StatisticsPanel, MediaSection, AdvancedOptions, OptionsSection, StatusDisplay };