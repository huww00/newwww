import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useProducts } from '../hooks/useProducts';

export default function Products() {
  const { products, loading, error, refetch } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    priceRange: [0, 100] as [number, number],
    categories: [] as string[],
    rating: 0,
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.Tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPrice = product.prixTTC >= filters.priceRange[0] && product.prixTTC <= filters.priceRange[1];
      
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.categoryId);
      
      const matchesRating = filters.rating === 0 || (product.rating && product.rating >= filters.rating);

      return matchesSearch && matchesPrice && matchesCategory && matchesRating;
    });
  }, [products, searchTerm, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Nos <span className="text-primary-500">produits</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Découvrez des plats délicieux dans notre menu varié
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Chargement des produits...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Nos <span className="text-primary-500">produits</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Découvrez des plats délicieux dans notre menu varié
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <ErrorMessage 
              message={error} 
              onRetry={refetch}
              className="max-w-md"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Nos <span className="text-primary-500">produits</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Découvrez des plats délicieux dans notre menu varié
          </p>
        </div>

        {/* Recherche et contrôles */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des produits, tags ou descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-600 dark:text-gray-300">Filtres</span>
              </button>
              
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-primary-500'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-primary-500'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Affichage de {filteredProducts.length} produits</span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Barre latérale pour ordinateur */}
          <div className="hidden lg:block w-64">
            <FilterSidebar
              isOpen={true}
              onClose={() => {}}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Grille de produits */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {products.length === 0 
                    ? "Aucun produit n'est disponible pour le moment. Veuillez réessayer plus tard."
                    : "Essayez d'ajuster votre recherche ou vos filtres"
                  }
                </p>
                {products.length === 0 && (
                  <button
                    onClick={refetch}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                  >
                    Actualiser
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}