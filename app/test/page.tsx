"use client";
import BlogIdeaGenerator from '@/components/HomepageComponent/BlogPostIdeaGenerator'
import ContentCreationGuide from '@/components/HomepageComponent/ContentCreationGuide'
import ReadingTimeBanner from '@/components/HomepageComponent/ReadingTimeBanner'
import React from 'react'

const page = () => {
    return (
        <div>
            <ContentCreationGuide />
            <ReadingTimeBanner />
            <BlogIdeaGenerator />
        </div>
    )
}

export default page
