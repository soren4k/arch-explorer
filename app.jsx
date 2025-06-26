// React and ReactDOM are expected to be available globally (from index.html)

// --- Constants ---
const DATA_URL = "googlemedia_data.json";
const LAZY_LOAD_BATCH_SIZE = 16;

// --- SVG Icons ---
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

// --- Helper Function for Confidence Color ---
const getConfidenceColorClass = (score) => {
  const numericScore = parseFloat(score);
  if (isNaN(numericScore)) return 'text-stone-500';
  if (numericScore >= 0.9) return 'text-green-600';
  if (numericScore >= 0.5) return 'text-yellow-600';
  return 'text-red-600';
};

// --- Reusable UI Components ---
function FilterCard({ title, children, className = '' }) {
    return (
        <div className={`bg-white p-4 rounded-lg border border-stone-200 shadow-sm ${className}`}>
            <h3 className="text-lg font-semibold text-stone-800 border-b border-stone-200 pb-2 mb-3">{title}</h3>
            {children}
        </div>
    );
}

function ArchitectSelector({ architects, selectedArchitect, onArchitectSelect }) {
  const [filterText, setFilterText] = React.useState("");
  const filteredArchitects = React.useMemo(() => {
    if (!architects || !Array.isArray(architects)) return [];
    if (!filterText) return architects;
    return architects.filter(arch => typeof arch === 'string' && arch.toLowerCase().includes(filterText.toLowerCase()));
  }, [architects, filterText]);

  return (
    <div className="flex flex-col">
        <input type="text" placeholder="Search architects..." value={filterText} onChange={(e) => setFilterText(e.target.value)} className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm mb-2"/>
        <div className="filter-scrollbar flex-grow overflow-y-auto max-h-36 border-t border-stone-200 pt-2">
            <div className="px-1 py-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="architect-selector" value="" checked={!selectedArchitect} onChange={() => onArchitectSelect(null)} className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500"/>
                <span className={`text-sm ${!selectedArchitect ? 'font-semibold text-teal-800' : 'text-gray-700'}`}>Any / None</span>
              </label>
            </div>
            {filteredArchitects.map((architect) => (
            <div key={architect} className="px-1 py-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="architect-selector" value={architect} checked={selectedArchitect === architect} onChange={() => onArchitectSelect(architect)} className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500"/>
                <span className={`text-sm ${selectedArchitect === architect ? 'font-semibold text-teal-800' : 'text-gray-700'}`}>{architect}</span>
              </label>
            </div>
          ))}
          {filteredArchitects.length === 0 && filterText && (<p className="px-3 py-2 text-sm text-stone-500 italic">No architects match filter.</p>)}
        </div>
    </div>
  );
}

function LocationSelector({ locations, selectedLocation, onLocationSelect }) {
  const [filterText, setFilterText] = React.useState("");
  const filteredLocations = React.useMemo(() => {
    if (!locations || !Array.isArray(locations)) return [];
    if (!filterText) return locations;
    return locations.filter(loc => typeof loc === 'string' && loc.toLowerCase().includes(filterText.toLowerCase()));
  }, [locations, filterText]);

  return (
    <div className="flex flex-col">
        <input type="text" placeholder="Search countries..." value={filterText} onChange={(e) => setFilterText(e.target.value)} className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm mb-2"/>
        <div className="filter-scrollbar flex-grow overflow-y-auto max-h-36 border-t border-stone-200 pt-2">
            <div className="px-1 py-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="location-selector" value="" checked={!selectedLocation} onChange={() => onLocationSelect(null)} className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500"/>
                <span className={`text-sm ${!selectedLocation ? 'font-semibold text-teal-800' : 'text-gray-700'}`}>Any / None</span>
              </label>
            </div>
            {filteredLocations.map((location) => (
            <div key={location} className="px-1 py-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="location-selector" value={location} checked={selectedLocation === location} onChange={() => onLocationSelect(location)} className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500"/>
                <span className={`text-sm ${selectedLocation === location ? 'font-semibold text-teal-800' : 'text-gray-700'}`}>{location}</span>
              </label>
            </div>
          ))}
          {filteredLocations.length === 0 && filterText && (<p className="px-3 py-2 text-sm text-stone-500 italic">No countries match filter.</p>)}
        </div>
    </div>
  );
}

function ConfirmationModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full border border-stone-200">
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 bg-stone-200 text-stone-800 rounded-md hover:bg-stone-300 transition duration-150">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150">Confirm</button>
        </div>
      </div>
    </div>
  );
}

function SubCategoryCard({ subCategory, onTagSelect, selectedTags }) {
    return (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 flex flex-col">
            <h4 className="font-semibold text-stone-700 mb-2 border-b border-stone-200 pb-2 flex-shrink-0">{subCategory.name}</h4>
            <div className="filter-scrollbar flex-grow overflow-y-auto space-y-1 pr-2 -mr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                    {(subCategory.tags || []).map(tag => {
                        const isSelected = selectedTags.has(tag);
                        return (
                            <label key={tag} className="flex items-center space-x-2 cursor-pointer p-1 rounded-md hover:bg-stone-100">
                                <input type="checkbox" checked={isSelected} onChange={() => onTagSelect(tag)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                                <span className={`text-sm ${isSelected ? 'font-semibold text-teal-800' : 'text-stone-700'}`}>{tag}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function TaxonomyFilterModal({ isOpen, onClose, category, onApply, initialSelectedTags }) {
  if (!isOpen || !category) return null;

  const filterInitialTagsForCategory = (tags) => {
    const categoryTags = new Set();
    (category.subCategories || []).forEach(sc => {
      (sc.tags || []).forEach(tag => categoryTags.add(tag));
    });
    return new Set(Array.from(tags).filter(tag => categoryTags.has(tag)));
  };
  
  const [selectedTags, setSelectedTags] = React.useState(() => filterInitialTagsForCategory(initialSelectedTags));
  
  const handleTagSelect = (tag) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      newSet.has(tag) ? newSet.delete(tag) : newSet.add(tag);
      return newSet;
    });
  };

  const handleApply = () => {
    onApply(category.category, selectedTags);
    onClose();
  };
  
  const subCategoryGridClass = (category.subCategories || []).length >= 3 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0 border-b border-stone-200 pb-3">
            <h2 className="text-xl font-semibold text-stone-800">Filter by: {category.category}</h2>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-800 text-3xl">&times;</button>
        </div>
        <div className={`flex-grow overflow-y-auto filter-scrollbar -m-2 p-2 grid ${subCategoryGridClass} gap-4`}>
            {(category.subCategories || []).map(subCat => (
                <SubCategoryCard key={subCat.name} subCategory={subCat} onTagSelect={handleTagSelect} selectedTags={selectedTags} />
            ))}
        </div>
        <div className="mt-4 pt-4 border-t border-stone-200 flex-shrink-0 flex justify-end">
             <button onClick={handleApply} className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700">Apply Filters</button>
        </div>
      </div>
    </div>
  );
}

function SelectedCriteriaDisplay({ criteria, onRemoveTag, onRemoveArchitect, onRemoveLocation }) {
    const hasSelections = criteria.architect || criteria.location || (criteria.tags && criteria.tags.size > 0);
    if (!hasSelections) {
        return (
            <div className="p-4 bg-white border border-dashed border-stone-300 rounded-lg text-center">
                <p className="text-stone-500 italic">Your selected criteria will appear here.</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-inner">
            <h3 className="font-semibold text-stone-700 mb-3">Selected Criteria:</h3>
            <div className="flex flex-wrap gap-2 items-center min-h-[2.5rem]">
              {criteria.architect && (<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">Architect: {criteria.architect}<button onClick={onRemoveArchitect} className="ml-2 -mr-1 text-purple-600 hover:text-purple-800 font-bold" aria-label="Remove architect">&times;</button></span>)}
              {criteria.location && (<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">Location: {criteria.location}<button onClick={onRemoveLocation} className="ml-2 -mr-1 text-blue-600 hover:text-blue-800 font-bold" aria-label="Remove location">&times;</button></span>)}
              {Array.from(criteria.tags || []).map(tag => (<span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 border border-teal-200">{tag}<button onClick={() => onRemoveTag(tag)} className="ml-2 -mr-1 text-teal-600 hover:text-teal-800 font-bold" aria-label={`Remove tag ${tag}`}>&times;</button></span>))}
            </div>
        </div>
    );
}


// --- Main Page Components ---

function SearchPage({ taxonomy, images, onSearch }) {
  const [selectedTags, setSelectedTags] = React.useState(new Set());
  const [selectedArchitect, setSelectedArchitect] = React.useState(null);
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [searchError, setSearchError] = React.useState(null);
  const [activeModalCategory, setActiveModalCategory] = React.useState(null);
  
  const [architectList, setArchitectList] = React.useState([]);
  const [locationList, setLocationList] = React.useState([]);

  React.useEffect(() => {
    if (images && images.length > 0) {
      const uniqueArchitects = [...new Set(images.map(img => img.architect).filter(Boolean))].sort();
      setArchitectList(uniqueArchitects);
      
      const uniqueLocations = [...new Set(images.map(img => img.ai_country).filter(loc => loc && !["unknown", "error_no_ai_response", "error_parsing"].includes(String(loc).toLowerCase())))].sort();
      setLocationList(uniqueLocations);
    }
  }, [images]);
  
  const handleApplyTagsFromModal = (categoryName, newSelectedTagsForCategory) => {
    const otherCategoryTags = Array.from(selectedTags).filter(tag => {
        const tagCategory = taxonomy.find(cat => cat.subCategories.some(sub => sub.tags.includes(tag)));
        return tagCategory ? tagCategory.category !== categoryName : true;
    });
    const finalTags = new Set([...otherCategoryTags, ...Array.from(newSelectedTagsForCategory)]);
    setSelectedTags(finalTags);
  };
  
  const removeTag = (tagToRemove) => setSelectedTags(prev => { const newSet = new Set(prev); newSet.delete(tagToRemove); return newSet; });
  const removeArchitect = () => setSelectedArchitect(null);
  const removeLocation = () => setSelectedLocation(null);

  const performSearch = () => {
    const criteria = { tags: Array.from(selectedTags), architect: selectedArchitect, location: selectedLocation };
    setSearchError(null);
    if (!images || images.length === 0) { setSearchError("Image data is not available."); return; }
    
    const results = images.filter(img => {
      const archMatch = !criteria.architect || img.architect === criteria.architect;
      if (!archMatch) return false;
      const locMatch = !criteria.location || (img.ai_country && String(img.ai_country).toLowerCase() === criteria.location.toLowerCase());
      if (!locMatch) return false;
      const imageTagNames = (img.visual_tags_with_confidence || []).map(t => t.tag);
      const tagsMatch = criteria.tags.every(tag => imageTagNames.includes(tag));
      if (criteria.tags.length > 0 && !tagsMatch) return false;
      return true;
    });

    if (results.length > 0) { onSearch(criteria); } 
    else { setSearchError("No images found matching the selected criteria."); }
  };
  
  const hasSelection = selectedTags.size > 0 || selectedArchitect || selectedLocation;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-3 text-stone-800">Visual Architecture Database</h1>
      <p className="text-center text-stone-600 text-lg mb-8">Construct your search using the filter cards below.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <FilterCard title="Architect">
                <ArchitectSelector architects={architectList} selectedArchitect={selectedArchitect} onArchitectSelect={setSelectedArchitect} />
            </FilterCard>
            <FilterCard title="Location (Country)">
                <LocationSelector locations={locationList} selectedLocation={selectedLocation} onLocationSelect={setSelectedLocation} />
            </FilterCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <FilterCard title="Visual Attributes" className="flex flex-col">
                <p className="text-sm text-stone-600 mb-4">Click a category to select specific visual tags.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(taxonomy || []).map(cat => (
                        <button key={cat.category} onClick={() => setActiveModalCategory(cat)} className="text-left p-3 bg-stone-100 hover:bg-stone-200 rounded-md border border-stone-200 transition-all duration-150 flex flex-col justify-between h-full">
                           <span className="font-semibold text-stone-700 block">{cat.category}</span>
                           <p className="text-xs text-stone-500 mt-1">Filter by {cat.subCategories.map(sc => sc.name.toLowerCase()).join(', ')}...</p>
                        </button>
                    ))}
                </div>
            </FilterCard>

            <SelectedCriteriaDisplay criteria={{ architect: selectedArchitect, location: selectedLocation, tags: selectedTags }} onRemoveTag={removeTag} onRemoveArchitect={removeArchitect} onRemoveLocation={removeLocation} />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button onClick={performSearch} className="px-12 py-4 bg-teal-600 text-white text-lg font-semibold rounded-md hover:bg-teal-700 disabled:opacity-50 transition-transform duration-150 hover:scale-105" disabled={!hasSelection}>
            Search Images
        </button>
        {searchError && (<div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-center shadow max-w-md mx-auto">{searchError}</div>)}
      </div>

      {activeModalCategory && (
        <TaxonomyFilterModal 
            isOpen={!!activeModalCategory} 
            onClose={() => setActiveModalCategory(null)}
            category={activeModalCategory}
            onApply={handleApplyTagsFromModal}
            initialSelectedTags={selectedTags}
        />
      )}
    </div>
  );
}

// Lightbox Modal for viewing a single image in detail
function LightboxModal({ image, onClose, onSearchTag }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <button onClick={onClose} className="absolute top-3 right-3 text-white text-3xl hover:text-stone-300 z-10">&times;</button>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto filter-scrollbar" onClick={(e) => e.stopPropagation()}>
            <DetailedImageView image={image} onSearchTag={onSearchTag} />
        </div>
    </div>
  );
}

// Reusable component for displaying the full details of a single image.
function DetailedImageView({ image, onSearchTag }) {
    const [isDetailsExpanded, setIsDetailsExpanded] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [tagToSearch, setTagToSearch] = React.useState(null);
    const [imageLoading, setImageLoading] = React.useState(true);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setImageLoading(true);
        setImageError(false);
    }, [image]);

    const handleOtherTagClick = (tag) => {
        setTagToSearch(tag);
        setShowConfirmModal(true);
    };

    const confirmNewSearch = () => {
        if (tagToSearch) {
          onSearchTag({ tags: [tagToSearch], architect: null });
        }
        setShowConfirmModal(false);
        setTagToSearch(null);
    };

    const cancelNewSearch = () => {
        setShowConfirmModal(false);
        setTagToSearch(null);
    };

    const getOverallAverageConfidence = (visualTags) => {
      if (!visualTags || visualTags.length === 0) return 0;
      const total = visualTags.reduce((sum, t) => sum + t.confidence, 0);
      return total / visualTags.length;
    };

    const imageFeatureStrength = getOverallAverageConfidence(image.visual_tags_with_confidence);
    const featureStrengthColorClass = getConfidenceColorClass(imageFeatureStrength);
    
    const buildingNameDisplay = image.ai_building_name && !["unknown", "error_no_ai_response", "error_parsing", ""].includes(String(image.ai_building_name).toLowerCase()) && (parseFloat(image.ai_building_name_confidence) > 0.01) ? image.ai_building_name : null;
    const architectDatesDisplay = (image.architect_birth_year || image.architect_death_year) ? `(${(image.architect_birth_year || '')}${(image.architect_birth_year && image.architect_death_year) ? ' - ' : ''}${(image.architect_death_year || '')})` : "";
    
    const buildingDetailsParts = [];
    if (image.ai_completion_date && !["unknown", "error_no_ai_response", "error_parsing", ""].includes(String(image.ai_completion_date).toLowerCase())) buildingDetailsParts.push(image.ai_completion_date);
    if (image.ai_city && !["unknown", "error_no_ai_response", "error_parsing", ""].includes(String(image.ai_city).toLowerCase())) buildingDetailsParts.push(image.ai_city);
    if (image.ai_country && !["unknown", "error_no_ai_response", "error_parsing", ""].includes(String(image.ai_country).toLowerCase())) buildingDetailsParts.push(image.ai_country);
    const buildingDetailsString = buildingDetailsParts.join(', ');

    return (
        <div className="w-full flex flex-col items-center">
            <div className="relative w-full mb-4 aspect-video bg-stone-100 rounded-lg flex items-center justify-center overflow-hidden">
                {imageLoading && (<div className="absolute inset-0 flex items-center justify-center bg-stone-200 text-stone-500">Loading...</div>)}
                {imageError && !imageLoading && (<div className="absolute inset-0 flex flex-col items-center justify-center bg-red-100 text-red-700 p-4"><p>Failed to load image.</p><p className="text-xs mt-1">URL: {image.imageUrl}</p></div>)}
                <img src={image.imageUrl} alt={`Architectural image: ${buildingNameDisplay ? buildingNameDisplay + ' by ' : ''}${image.architect || 'various architects'}`} className={`block max-w-full max-h-[60vh] object-contain transition-opacity duration-300 ${imageLoading || imageError ? 'opacity-0' : 'opacity-100'}`} onLoad={() => setImageLoading(false)} onError={() => { setImageLoading(false); setImageError(true); }} />
            </div>

            <div className="text-center">
              <p className="text-xl font-semibold text-stone-800">
                {image.architect || 'Unknown Architect'}
                {architectDatesDisplay && <span className="font-normal text-stone-600 text-lg ml-1">{architectDatesDisplay}</span>}
              </p>
            </div>
            <div className="text-center text-stone-700 mt-1">
                <p className="text-lg">
                    {buildingNameDisplay ? (<><span className="italic">{buildingNameDisplay}</span>{buildingDetailsString && <span>, {buildingDetailsString}</span>}</>) : ("Building unknown")}
                </p>
            </div>
            
            <div className="w-full max-w-2xl mt-4">
                <div className="border-t border-stone-200 pt-3">
                    <button onClick={() => setIsDetailsExpanded(!isDetailsExpanded)} className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center gap-1 mx-auto">
                        {isDetailsExpanded ? 'Hide Details' : 'Show More Details'}
                        {isDetailsExpanded ? <ChevronDownIcon/> : <ChevronRightIcon/>}
                    </button>
                </div>
            </div>

            {isDetailsExpanded && (
                <div className="w-full max-w-2xl text-center mt-4 animate-fade-in">
                    <div className="my-3 text-sm text-stone-600">
                        <span>Image Feature Strength: </span>
                        <span className={`font-semibold ${featureStrengthColorClass}`}>{imageFeatureStrength.toFixed(2)}</span>
                        {image.width && image.height && (<span className="ml-3 text-stone-500">({image.width}w x {image.height}h)</span>)}
                    </div>

                    <div className="text-center mt-1 mb-2">
                        <a href={image.imageUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline break-all">Source Link: {(image.imageUrl || '').substring((image.imageUrl || '').lastIndexOf('/') + 1) || 'N/A'}</a>
                    </div>

                    <div className="w-full text-center mb-2">
                      <h3 className="font-semibold mb-2 text-stone-700">AI Visual Tags for this Image:</h3>
                      <div className="flex flex-wrap justify-center gap-2">
                        {image.visual_tags_with_confidence && image.visual_tags_with_confidence.length > 0 ? (
                          image.visual_tags_with_confidence.map((tagObj) => (
                            <button key={tagObj.tag} onClick={() => handleOtherTagClick(tagObj.tag)} className={`text-sm font-medium px-3 py-1 rounded-full hover:opacity-80 transition duration-150 border ${parseFloat(tagObj.confidence) >= 0.9 ? 'bg-green-100 text-green-700 border-green-300' : parseFloat(tagObj.confidence) >= 0.5 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                              {tagObj.tag} <span className={`font-normal opacity-80 ${getConfidenceColorClass(tagObj.confidence)}`}>({(parseFloat(tagObj.confidence) || 0).toFixed(2)})</span>
                            </button>
                          ))
                        ) : (<p className="text-sm text-stone-500 italic">No visual tags identified by AI for this image.</p>)}
                      </div>
                    </div>
                </div>
            )}
            <ConfirmationModal isOpen={showConfirmModal} message={`Start a new search for images tagged with "${tagToSearch}"?`} onConfirm={confirmNewSearch} onCancel={cancelNewSearch} />
        </div>
    );
}

// Image Card for Grid View
function ImageCard({ image, onClick }) {
    const buildingNameDisplay = image.ai_building_name && !["unknown", "error_no_ai_response", "error_parsing", ""].includes(String(image.ai_building_name).toLowerCase()) && (parseFloat(image.ai_building_name_confidence) > 0.01) ? image.ai_building_name : null;

    return (
        <div className="group relative aspect-[4/3] bg-stone-200 rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300" onClick={onClick}>
            <img 
                src={image.imageUrl} 
                alt={buildingNameDisplay || image.architect} 
                className="w-full h-full object-cover" 
                loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white font-semibold text-sm truncate">{image.architect || "Unknown Architect"}</p>
                {buildingNameDisplay && (
                    <p className="text-white text-xs italic truncate">{buildingNameDisplay}</p>
                )}
            </div>
        </div>
    );
}

// NEW: Modal for Refining the Current Search
function RefineSearchModal({ isOpen, onClose, onUpdateSearch, initialCriteria, taxonomy, images }) {
  if (!isOpen) return null;

  const [selectedTags, setSelectedTags] = React.useState(new Set(initialCriteria.tags || []));
  const [selectedArchitect, setSelectedArchitect] = React.useState(initialCriteria.architect || null);
  const [selectedLocation, setSelectedLocation] = React.useState(initialCriteria.location || null);
  const [searchError, setSearchError] = React.useState(null);
  
  const [architectList, setArchitectList] = React.useState([]);
  const [locationList, setLocationList] = React.useState([]);
  const [activeModalCategory, setActiveModalCategory] = React.useState(null);


  React.useEffect(() => {
    if (images && images.length > 0) {
      const uniqueArchitects = [...new Set(images.map(img => img.architect).filter(Boolean))].sort();
      setArchitectList(uniqueArchitects);
      const uniqueLocations = [...new Set(images.map(img => img.ai_country).filter(loc => loc && !["unknown", "error_no_ai_response", "error_parsing"].includes(String(loc).toLowerCase())))].sort();
      setLocationList(uniqueLocations);
    }
  }, [images]);

  const handleApplyTagsFromModal = (categoryName, newSelectedTagsForCategory) => {
    const otherCategoryTags = Array.from(selectedTags).filter(tag => {
        const tagCategory = taxonomy.find(cat => cat.subCategories.some(sub => sub.tags.includes(tag)));
        return tagCategory ? tagCategory.category !== categoryName : true;
    });
    const finalTags = new Set([...otherCategoryTags, ...Array.from(newSelectedTagsForCategory)]);
    setSelectedTags(finalTags);
  };
  
  const removeTag = (tagToRemove) => setSelectedTags(prev => { const newSet = new Set(prev); newSet.delete(tagToRemove); return newSet; });
  const removeArchitect = () => setSelectedArchitect(null);
  const removeLocation = () => setSelectedLocation(null);
  
  const handleUpdate = () => {
      setSearchError(null);
      const newCriteria = { tags: Array.from(selectedTags), architect: selectedArchitect, location: selectedLocation };
      
      const prospectiveResults = images.filter(img => {
        const archMatch = !newCriteria.architect || img.architect === newCriteria.architect;
        if (!archMatch) return false;
        const locMatch = !newCriteria.location || (img.ai_country && String(img.ai_country).toLowerCase() === newCriteria.location.toLowerCase());
        if(!locMatch) return false;
        const imageTagNames = (img.visual_tags_with_confidence || []).map(t => t.tag);
        const tagsMatch = newCriteria.tags.every(tag => imageTagNames.includes(tag));
        if (newCriteria.tags.length > 0 && !tagsMatch) return false;
        return true;
      });
      
      if (prospectiveResults.length > 0) {
        onUpdateSearch(newCriteria);
        onClose();
      } else {
        setSearchError("No images found for these new criteria.");
      }
  };

  const hasSelection = selectedTags.size > 0 || selectedArchitect || selectedLocation;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-stone-50 p-4 md:p-6 rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-stone-800">Refine Your Search</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-800 text-3xl">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto filter-scrollbar p-2 -m-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <FilterCard title="Architect"><ArchitectSelector architects={architectList} selectedArchitect={selectedArchitect} onArchitectSelect={setSelectedArchitect} /></FilterCard>
                    <FilterCard title="Location (Country)"><LocationSelector locations={locationList} selectedLocation={selectedLocation} onLocationSelect={setSelectedLocation} /></FilterCard>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <FilterCard title="Visual Attributes" className="flex flex-col">
                        <p className="text-sm text-stone-600 mb-4">Click a category to select specific visual tags.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(taxonomy || []).map(cat => (
                                <button key={cat.category} onClick={() => setActiveModalCategory(cat)} className="text-left p-3 bg-stone-100 hover:bg-stone-200 rounded-md border border-stone-200 transition-all duration-150 flex flex-col justify-between h-full">
                                   <span className="font-semibold text-stone-700 block">{cat.category}</span>
                                   <p className="text-xs text-stone-500 mt-1">Filter by {cat.subCategories.map(sc => sc.name.toLowerCase()).join(', ')}...</p>
                                </button>
                            ))}
                        </div>
                    </FilterCard>
                </div>
            </div>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-200 flex-shrink-0">
            <SelectedCriteriaDisplay criteria={{ architect: selectedArchitect, location: selectedLocation, tags: selectedTags }} onRemoveTag={removeTag} onRemoveArchitect={removeArchitect} onRemoveLocation={removeLocation} />
            {searchError && (<div className="mt-2 p-2 text-sm bg-red-100 border border-red-300 text-red-700 rounded-md text-center">{searchError}</div>)}
            <div className="text-center mt-4">
              <button onClick={handleUpdate} className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:opacity-50" disabled={!hasSelection}>Update Search</button>
            </div>
        </div>
      </div>
      {activeModalCategory && (
        <TaxonomyFilterModal 
            isOpen={!!activeModalCategory} 
            onClose={() => setActiveModalCategory(null)}
            category={activeModalCategory}
            onApply={handleApplyTagsFromModal}
            initialSelectedTags={selectedTags}
        />
      )}
    </div>
  );
}


function ResultsPage({ images, taxonomy, searchCriteria, onHome, onSearchTag }) {
  const [viewMode, setViewMode] = React.useState('grid');
  const [lightboxImageIndex, setLightboxImageIndex] = React.useState(null);
  const [listImageIndex, setListImageIndex] = React.useState(0);
  const [isRefineModalOpen, setIsRefineModalOpen] = React.useState(false);
  const [visibleImageCount, setVisibleImageCount] = React.useState(LAZY_LOAD_BATCH_SIZE);
  
  const rankedImages = React.useMemo(() => {
    if (!images || images.length === 0) return [];
    const { architect, location, tags: queryTags = [] } = searchCriteria;
    
    let preliminaryFilter = images.filter(img => {
      const archMatch = !architect || img.architect === architect;
      if (!archMatch) return false;
      const locMatch = !location || (img.ai_country && String(img.ai_country).toLowerCase() === location.toLowerCase());
      if (!locMatch) return false;
      const imageTagNames = (img.visual_tags_with_confidence || []).map(t => t.tag);
      const tagsMatch = queryTags.every(tag => imageTagNames.includes(tag));
      if (queryTags.length > 0 && !tagsMatch) return false;
      return true;
    });

    preliminaryFilter.sort((a, b) => {
      const getTagConfidence = (tags, target) => (tags.find(t=>t.tag === target) || {confidence:0}).confidence;
      const getAvgConfidence = (tags) => tags.length === 0 ? 0 : tags.reduce((sum, t) => sum + t.confidence, 0) / tags.length;
      
      const aTags = a.visual_tags_with_confidence || [];
      const bTags = b.visual_tags_with_confidence || [];

      if (queryTags.length === 0) {
        return getAvgConfidence(bTags) - getAvgConfidence(aTags);
      } else if (queryTags.length === 1) {
        return getTagConfidence(bTags, queryTags[0]) - getTagConfidence(aTags, queryTags[0]);
      } else {
        const avgA = queryTags.reduce((sum, t) => sum + getTagConfidence(aTags, t), 0) / queryTags.length;
        const avgB = queryTags.reduce((sum, t) => sum + getTagConfidence(bTags, t), 0) / queryTags.length;
        return avgB - avgA;
      }
    });

    return preliminaryFilter;
  }, [images, searchCriteria]);
  
  React.useEffect(() => {
    const handleScroll = () => {
        if (viewMode === 'grid' && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            setVisibleImageCount(prevCount => prevCount + LAZY_LOAD_BATCH_SIZE);
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  React.useEffect(() => {
    setVisibleImageCount(LAZY_LOAD_BATCH_SIZE);
    setLightboxImageIndex(null);
    setListImageIndex(0);
  }, [searchCriteria]);

  const totalImages = rankedImages.length;
  const currentListImage = totalImages > 0 ? rankedImages[listImageIndex] : null;
  
  const handleNextInList = () => setListImageIndex((prev) => (prev + 1) % totalImages);
  const handlePreviousInList = () => setListImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  
  const displayCriteria = () => {
    let parts = [];
    if (searchCriteria.architect) parts.push(`Architect: "${searchCriteria.architect}"`);
    if (searchCriteria.location) parts.push(`Location: "${searchCriteria.location}"`);
    if (searchCriteria.tags && searchCriteria.tags.length > 0) parts.push(`Tags: [${searchCriteria.tags.map(t => `"${t}"`).join(', ')}]`);
    return parts.join(' AND ') || "All Images (Ranked by Overall Avg. Confidence)";
  };

  return (
    <div className="relative min-h-screen">
      {isRefineModalOpen && (
        <RefineSearchModal 
            isOpen={isRefineModalOpen}
            onClose={() => setIsRefineModalOpen(false)}
            onUpdateSearch={onSearchTag}
            initialCriteria={searchCriteria}
            taxonomy={taxonomy}
            images={images}
        />
      )}
      
      <div className="p-4 md:p-8">
        <div className="fixed top-4 left-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 z-20">
          <button onClick={onHome} className="px-4 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 shadow">&larr; Home</button>
          <button onClick={() => setIsRefineModalOpen(true)} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 shadow">Refine Search</button>
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="px-4 py-2 bg-white text-stone-700 rounded-md hover:bg-stone-100 shadow border border-stone-200">
            Switch to {viewMode === 'grid' ? 'List' : 'Grid'} View
          </button>
        </div>
        <h2 className="text-lg md:text-xl font-semibold text-center mt-24 mb-4 text-stone-700">Showing {totalImages} images for: <span className="font-bold text-teal-700">{displayCriteria()}</span></h2>
        
        {totalImages === 0 && (<p className="text-center text-red-600 mt-10">No images found for the selected criteria.</p>)}
        
        {viewMode === 'grid' && totalImages > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {rankedImages.slice(0, visibleImageCount).map((image, index) => (
                    <ImageCard key={image.local_path || image.imageUrl} image={image} onClick={() => setLightboxImageIndex(index)} />
                ))}
            </div>
        )}
        
        {viewMode === 'list' && totalImages > 0 && (
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <div className="relative w-full">
                    {totalImages > 1 && (
                      <>
                        <button onClick={handlePreviousInList} className="absolute left-2 md:-left-12 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 z-10" aria-label="Previous">&#x25C0;</button>
                        <button onClick={handleNextInList} className="absolute right-2 md:-right-12 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 z-10" aria-label="Next">&#x25B6;</button>
                      </>
                    )}
                    <DetailedImageView image={currentListImage} onSearchTag={onSearchTag} />
                </div>
                <p className="text-center text-stone-600 font-medium mt-4">Image {listImageIndex + 1} / {totalImages}</p>
            </div>
        )}

      </div>
      {lightboxImageIndex !== null && (
          <LightboxModal image={rankedImages[lightboxImageIndex]} onClose={() => setLightboxImageIndex(null)} onSearchTag={onSearchTag} />
      )}
    </div>
  );
}

// --- Main App Component ---
function App() {
  const [view, setView] = React.useState('search');
  const [appData, setAppData] = React.useState({ taxonomy: [], images: [] });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [currentSearchCriteria, setCurrentSearchCriteria] = React.useState({ tags: [], architect: null, location: null });

  React.useEffect(() => {
    fetch(DATA_URL)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status} while fetching ${DATA_URL}`);
        return response.json();
      })
      .then(data => {
        if (!data.taxonomy_transformed || !data.images) {
          throw new Error("JSON data missing 'taxonomy_transformed' or 'images'.");
        }
        
        const processedImages = data.images.map(image => {
          let parsedVisualTags = [];
          if (image.ai_visual_tags) {
            try {
              const tagsData = JSON.parse(image.ai_visual_tags);
              if (Array.isArray(tagsData)) {
                parsedVisualTags = tagsData.filter(tagObj => 
                  typeof tagObj === 'object' && tagObj !== null && 'tag' in tagObj && 'confidence' in tagObj && !isNaN(parseFloat(tagObj.confidence))
                ).map(tagObj => ({ 
                    ...tagObj,
                    confidence: parseFloat(tagObj.confidence)
                }));
              }
            } catch (e) { /* silent fail */ }
          }
          return {
            ...image,
            visual_tags_with_confidence: parsedVisualTags, 
            imageUrl: image.imageUrl || image.image_url 
          };
        });

        setAppData({ taxonomy: data.taxonomy_transformed, images: processedImages });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load or process data:", err);
        setError(`Failed to load or process data. ${err.message}. Check if '${DATA_URL}' is available and correctly formatted.`);
        setLoading(false);
      });
  }, []);

  const handleSearch = (criteria) => {
    setCurrentSearchCriteria(criteria);
    setView('results');
  };

  const handleHome = () => {
    setView('search');
    setCurrentSearchCriteria({ tags: [], architect: null, location: null });
  };

  const renderView = () => {
    if (loading) return <div className="text-center p-10 text-lg text-stone-600">Loading architectural data...</div>;
    if (error) return <div className="text-center p-10 text-red-700 bg-red-100 border border-red-300 rounded-md shadow">{error}</div>;
    
    switch (view) {
      case 'results':
        return <ResultsPage images={appData.images} taxonomy={appData.taxonomy} searchCriteria={currentSearchCriteria} onHome={handleHome} onSearchTag={handleSearch} />;
      default: 
        return <SearchPage taxonomy={appData.taxonomy} images={appData.images} onSearch={handleSearch} />;
    }
  };

  return (<div className="min-h-screen bg-stone-100 text-stone-900">{renderView()}</div>);
}
