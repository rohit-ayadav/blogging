"use client";
import React, { use, useCallback, useEffect, useState } from 'react'
import { StatsType } from '@/types/blogs-types';
import { BlogPostType, UserType } from '@/types/blogs-types';
import { useInView } from '@react-spring/web';
import HomePageBlogCollection from './components/HomePageBlogCollection';

interface PostsData {
    success: boolean;
    data: BlogPostType[];
    stats: StatsType;
    metadata: {
        currentPage: number;
        totalPages: number;
        totalPosts: number;
        hasMore: boolean;
    };
}

const BlogCollection = () => {
    const [ref, inView] = useInView();
    const [state, setState] = useState({
        posts: [] as BlogPostType[],
        users: {} as Record<string, UserType>,
        loading: true,
        loadingMore: false,
        error: null as string | null,
        searchTerm: '',
        sortBy: 'newest',
        category: 'all',
        page: 1,
        limit: 9,
        stats: {
            totalLikes: 0,
            totalViews: 0,
            totalBlogs: 0,
            totalUsers: 0
        } as StatsType,
        metadata: {
            currentPage: 1,
            totalPages: 1,
            totalPosts: 0,
            hasMore: false,
            resultsPerPage: 9
        },
        statsLoading: true,
        initialized: false
    });
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        setSearchLoading(true);
        const timer = setTimeout(() => {
            if (state.initialized) {
                fetchPosts();
            }
            setSearchLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [state.searchTerm]);

    useEffect(() => {
        state.initialized = true;
    }, []);

    useEffect(() => {
        if (inView && state.metadata.hasMore && !state.loadingMore && !state.loading && state.initialized) {
            setState(prev => ({ ...prev, loadingMore: true }));

            const timer = setTimeout(() => {
                // After 2 seconds, fetch more data
                setState(prev => ({
                    ...prev,
                    page: prev.page + 1,
                }));
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [inView, state.metadata.hasMore]);

    const fetchPosts = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const res = await fetch(`/api/blogs?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&search=${state.searchTerm}&category=${state.category}`);
            const data: PostsData = await res.json();

            setState(prev => ({
                ...prev,
                posts: state.page === 1 ? data.data : [...state.posts, ...data.data],
                stats: data.stats,
                metadata: {
                    ...data.metadata,
                    resultsPerPage: state.metadata.resultsPerPage
                },
                loading: false,
                loadingMore: false,
                statsLoading: false
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.message,
                loading: false,
                loadingMore: false
            }));
        }
    };

    useEffect(() => {
        if (state.initialized) {
            fetchPosts();
        }
    }, [state.page, state.category, state.sortBy, state.initialized]);

    const handleRetry = useCallback(() => {
        setState(prev => ({
            ...prev,
            page: 1,
            loading: true,
            error: null
        }));
        fetchPosts();
    }, [fetchPosts]);

    return (
        <>
            <HomePageBlogCollection state={state} handleRetry={handleRetry} setState={setState} searchLoading={searchLoading} />
            <div ref={ref} className='h-8' />
        </>
    );
}

export default BlogCollection;
