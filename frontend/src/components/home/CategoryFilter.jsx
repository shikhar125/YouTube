import { useNavigate, useLocation } from 'react-router-dom';

const categories = [
  'All', 'Programming', 'Music', 'Gaming', 'Sports', 'News', 
  'Learning', 'Comedy', 'Vlogs', 'Podcasts', 'Cooking'
];

const CategoryFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category') || 'All';

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    
    navigate({
      pathname: '/',
      search: searchParams.toString()
    });
  };

  return (
    <div className="flex overflow-x-auto pb-3 scrollbar-hide space-x-2 mb-6 md:mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${
            currentCategory === category
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;