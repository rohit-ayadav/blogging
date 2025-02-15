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
        <Card className="w-full mt-3 transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center">
                    <FolderOpen className="w-5 h-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-base sm:text-lg md:text-xl font-bold">Category</CardTitle>
                </div>
                {/* {category && (
                    <span className="text-xs sm:text-sm text-muted-foreground">
                        Selected: {categories.find(cat => cat.value === category)?.label}
                    </span>
                )} */}
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-3">
                    <div className="space-y-2">
                        <Label 
                            htmlFor="category" 
                            className="text-sm text-muted-foreground inline-block"
                        >
                            Select a category for your content
                        </Label>
                        <Select
                            value={category}
                            onValueChange={setCategory}
                        >
                            <SelectTrigger 
                                id="category"
                                className="w-full bg-background border-input focus:ring-2 focus:ring-ring"
                            >
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.value}
                                            value={cat.value}
                                            className="cursor-pointer hover:bg-accent transition-colors duration-150"
                                        >
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {!category && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                            Please select a category to help organize your content
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CategorySection;