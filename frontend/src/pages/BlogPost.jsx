import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import axios from 'axios';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/${slug}`);
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        navigate('/journal'); // Redirect to list if not found
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <>
      <SEO 
        title={blog.seoTitle || `${blog.title} | Sera Jewels`}
        description={blog.seoDescription || blog.title}
        canonicalUrl={`https://www.serastore.in/journal/${blog.slug}`}
        ogImage={blog.coverImage || undefined}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": blog.title,
          "image": blog.coverImage ? [blog.coverImage] : [],
          "datePublished": new Date(blog.createdAt).toISOString(),
          "dateModified": new Date(blog.updatedAt || blog.createdAt).toISOString(),
          "author": [{
              "@type": "Organization",
              "name": "Sera Jewels",
              "url": "https://www.serastore.in"
          }]
        }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16 bg-white">
        
        {/* Back Link */}
        <Link to="/journal" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors mb-8 font-inter font-medium tracking-wide">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          BACK TO JOURNAL
        </Link>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {blog.tags && blog.tags.map((tag, i) => (
              <span key={i} className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-4 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold text-gray-900 leading-tight mb-6">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-center text-gray-500 font-inter text-sm gap-4">
            <span>By Sera Jewels</span>
            <span>•</span>
            <time>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
          </div>
        </header>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        )}

        {/* Rich Text Content */}
        <div 
          className="prose prose-lg max-w-none font-inter text-gray-700 prose-headings:font-playfair prose-headings:font-semibold prose-a:text-primary prose-img:rounded-xl prose-primary"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center">
          <p className="text-gray-500 font-inter mb-4 text-center">Loved this article? Shop the collection below.</p>
          <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-full font-inter font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg">
            Shop Sera Jewels
          </Link>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
