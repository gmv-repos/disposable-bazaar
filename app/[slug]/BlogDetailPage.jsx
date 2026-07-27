"use client";
import React, { useEffect, useState } from 'react';
import { Image_Url, Assets_Url } from '../src/const';
import { RiFilter3Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import BlogSlider from '../src/components/BlogSlider';
import { usePathname } from 'next/navigation';
import axios from '../src/Utils/axios';
import { Loader } from '../src/components/Loader';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import BlogBody from '../src/components/BlogBody';
import { API_BASE } from '../../constants/constants';

const BlogDetail = ({ initialBlog = null, initialRecommended = [] }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [blog, setBlog] = useState(initialBlog);
  const [recommendedBlogs, setRecomendedBlogs] = useState(initialRecommended);
  const [isLoading, setIsLoading] = useState(initialBlog ? false : true);
  const [errorMessage, setErrorMessage] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const location = usePathname();
  const blogId = location.split("/")[1];

  const fetchBlogById = async (blogId) => {
    setIsLoading(true);
    try {
      const response = await axios.public.post(`blogs/s/details`, {
        slug: `${blogId}/`,
      });
      if (response.data.status === "warning") {
        setBlog(null);
        setErrorMessage(response.data.message);
      } else if (response.data.status === "success") {
        const blogData = response.data.data.blog;
        setBlog(blogData);
        setRecomendedBlogs(response.data.data.recommended_blogs);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to load blog");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlogByCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await axios.public.get(`blogs/category_wise/${categoryId}`);
      if (response.data.status === "warning") {
        setBlog(null);
        setErrorMessage(response.data.message);
      } else if (response.data.data && response.data.data.length > 0) {
        setBlog(response.data.data[0]);
      }
    } catch (error) {
      console.log("API error:", error);
      setErrorMessage("Something went wrong, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialBlog && blogId) {
      fetchBlogById(blogId);
    } else if (initialBlog && !initialBlog.main_image && blogId) {
      fetch(`${API_BASE}/blogs/index`)
        .then(r => r.json())
        .then(json => {
          const match = json?.data?.find(b => b.slug === `${blogId}/` || b.slug === blogId);
          if (match?.main_image) {
            setBlog(prev => ({ ...prev, main_image: match.main_image.replace(/\/+$/, '') }));
          }
        })
        .catch(() => { });
    }
  }, [blogId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.public.get('product/category');
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) return <Loader />;
  if (errorMessage) {
    return (
      <div className='bg-[#20202C] min-h-96 flex items-center justify-center'>
        <div className='text-white text-center'>
          <h2 className='text-2xl font-bold mb-4'>Error</h2>
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#20202C] w-full overflow-x-hidden'>
      {/* Blog Cover */}
      {blog && (
        <div
          className="flex items-end relative min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px] text-white w-full"
          style={{
            background: `url('${blog.main_image ? `${Assets_Url}${blog.main_image}`.replace(/\/+$/, '') : Image_Url + "BlogsSection/BlogCover.svg"}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '25rem',
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className='px-4 sm:px-6 md:px-10 lg:pl-32 lg:pb-24 pb-12 relative z-10 w-full'>
            <div className='flex gap-2 flex-wrap text-sm sm:text-base'>
              <p>Categories: {blog.category} -</p>
              <p>{blog.date}</p>
            </div>
            <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:w-2/3 w-full'>{blog.title}</h1>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='w-full mt-8 md:mt-16 overflow-x-hidden'>
        <div className="lg:hidden flex justify-end p-3 sm:p-4">
          <button
            onClick={toggleSidebar}
            className="text-white text-xl flex justify-center items-center bg-[#1E7773] p-2 rounded-full"
          >
            <RiFilter3Line />
          </button>
        </div>

        {/* Flex container - restructured for mobile */}
        <div className='flex flex-col lg:flex-row gap-0 w-full'>
          {/* Sidebar - desktop */}
          <div className='hidden lg:block md:ml-10 w-72 flex-shrink-0'>
            <BlogSidebarDesktop
              onCategorySelect={fetchBlogByCategory}
              categories={categories}
            />
          </div>

          {/* Blog Content - moved to top on mobile */}
          <div className='text-white w-full lg:flex-1 lg:min-w-0 px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10'>
            {blog ? (
              <div className="w-full overflow-x-hidden break-words">
                <BlogBody body={blog.body} />
              </div>
            ) : (
              <p>No blog selected yet.</p>
            )}
          </div>
        </div>

        {/* Mobile Sidebar (off-canvas) */}
        <MobileSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onCategorySelect={fetchBlogByCategory}
          categories={categories}
        />

        {recommendedBlogs && <BlogSlider blogsCategories={recommendedBlogs} />}
      </div>
    </div>
  );
};

// Desktop Sidebar Component
const BlogSidebarDesktop = ({ onCategorySelect, categories }) => {
  return (
    <div className="bg-[#33333F] text-white p-4 rounded-lg">
      <div className="mb-6 p-4 bg-[#33333F] rounded-lg w-full">
        <h2 className="text-lg font-semibold mb-4">CATEGORIES</h2>
        <ul className="h-auto overflow-y-auto max-h-96">
          {categories.map((category) => (
            <li
              key={category.id}
              className="text-base hover:text-gray-400 cursor-pointer border-b border-gray-500 py-4"
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 p-4 rounded-lg w-full">
        <h3 className='font-bazaar text-xl text-white mb-4'>SHARE ARTICLE</h3>
        <ul className='flex flex-row gap-4'>
          <li className='text-white p-2 rounded-full hover:bg-[#1E7773]'><a aria-label="Facebook" href="https://www.facebook.com/DisposableBazar/"><FaFacebookF /></a></li>
          <li className='text-white p-2 rounded-full hover:bg-[#1E7773]'><a aria-label="Instagram" href="https://www.instagram.com/disposablebazaar/"><FaInstagram /></a></li>
          <li className='text-white p-2 rounded-full hover:bg-[#1E7773]'><a aria-label="Tiktok" href="https://www.tiktok.com/@disposablebazaar"><FaTiktok /></a></li>
          <li className='text-white p-2 rounded-full hover:bg-[#1E7773]'><a aria-label="Youtube" href="https://www.youtube.com/@disposablebazaar"><FaYoutube /></a></li>
        </ul>
      </div>
    </div>
  );
};

// Mobile Sidebar Component (off-canvas)
const MobileSidebar = ({ isSidebarOpen, toggleSidebar, onCategorySelect, categories }) => {
  return (
    <>
      <div
        className={`fixed lg:hidden top-0 left-0 h-full w-72 bg-[#33333F] text-white p-4 transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex justify-end mb-4">
          <button onClick={toggleSidebar} className="text-white text-xl p-2">
            <RxCross2 />
          </button>
        </div>

        <div className="mb-6 p-4 bg-[#33333F] rounded-lg w-full">
          <h2 className="text-lg font-semibold mb-4">CATEGORIES</h2>
          <ul className="h-auto overflow-y-auto max-h-96">
            {categories.map((category) => (
              <li
                key={category.id}
                className="text-base hover:text-gray-400 cursor-pointer border-b border-gray-500 py-4"
                onClick={() => {
                  onCategorySelect(category.id);
                  toggleSidebar();
                }}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6 p-4 rounded-lg w-full">
          <h3 className='font-bazaar text-xl text-white mb-4'>SHARE ARTICLE</h3>
          <ul className='flex flex-row gap-4'>
            <li className='text-white p-2 rounded-full hover:bg-[#1E7773]'><a aria-label="Facebook" href="https://www.facebook.com/DisposableBazar/"><FaFacebookF /></a></li>
            <li className='text-white p-2 rounded-full hover:bg-[#1E7773]'><a aria-label="Instagram" href="https://www.instagram.com/disposablebazaar/"><FaInstagram /></a></li>
            <li className='text-white p-2 rounded-full hover:bg-[#1E7773]'><a aria-label="Tiktok" href="https://www.tiktok.com/@disposablebazaar"><FaTiktok /></a></li>
            <li className='text-white p-2 rounded-full hover:bg-[#1E7773]'><a aria-label="Youtube" href="https://www.youtube.com/@disposablebazaar"><FaYoutube /></a></li>
          </ul>
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-40 lg:hidden"
        />
      )}
    </>
  );
};

export default BlogDetail;
