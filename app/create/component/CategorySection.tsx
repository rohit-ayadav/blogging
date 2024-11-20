import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FolderOpen } from "lucide-react";

interface CategorySectionProps {
    category: string;
    setCategory: (category: string) => void;
    categories: Array<{ value: string; label: string; }>;
    isDarkMode?: boolean;
}

export const CategorySection = ({
    category,
    setCategory,
    categories
}: CategorySectionProps) => {
    return (
        <Card className="w-full mt-3">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <FolderOpen className="w-5 h-5 mr-2 text-muted-foreground" />
                <CardTitle className="text-xl font-bold">Category</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="category" className="text-sm text-muted-foreground">
                        Select a category for your content
                    </Label>
                    <Select
                        value={category}
                        onValueChange={setCategory}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem
                                    key={cat.value}
                                    value={cat.value}
                                    className="cursor-pointer hover:bg-accent"
                                >
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {!category && (
                        <p className="text-sm text-muted-foreground">
                            Please select a category to help organize your content
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CategorySection;