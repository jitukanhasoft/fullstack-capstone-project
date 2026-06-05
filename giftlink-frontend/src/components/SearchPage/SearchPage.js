import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';

function SearchPage() {
    // Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];
    const navigate = useNavigate();

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;
                console.log(url);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);

    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        try {
            let url = `${urlConfig.backendUrl}/api/search?`;
            const params = [];
            if (searchQuery) params.push(`name=${encodeURIComponent(searchQuery)}`);
            if (category) params.push(`category=${encodeURIComponent(category)}`);
            if (condition) params.push(`condition=${encodeURIComponent(condition)}`);
            if (ageRange) params.push(`age_years=${ageRange}`);
            
            url += params.join('&');
            console.log("Searching at URL:", url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.log('Search error: ' + error.message);
        }
    };

    const goToDetailsPage = (productId) => {
        // Task 6. Enable navigation to the details page of a selected gift.
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Task 3: Dynamically generate category and condition dropdown options.*/}
                            <label htmlFor="categorySelect" className="form-label mt-2">Category</label>
                            <select
                                id="categorySelect"
                                className="form-select mb-3 dropdown-filter"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <label htmlFor="conditionSelect" className="form-label">Condition</label>
                            <select
                                id="conditionSelect"
                                className="form-select mb-3 dropdown-filter"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            >
                                <option value="">All Conditions</option>
                                {conditions.map(cond => (
                                    <option key={cond} value={cond}>{cond}</option>
                                ))}
                            </select>

                            {/* Task 4: Implement an age range slider and display the selected value. */}
                            <label htmlFor="ageRange" className="form-label">Less than or equal to {ageRange} years</label>
                            <input
                                type="range"
                                className="form-range age-range-slider"
                                id="ageRange"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Task 7: Add text input field for search criteria*/}
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search for gifts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {/* Task 8: Implement search button with onClick event to trigger search:*/}
                        <button className="btn btn-primary search-button px-4" onClick={handleSearch}>Search</button>
                    </div>

                    {/*Task 5: Display search results and handle empty results with a message. */}
                    <div className="search-results mt-4">
                        {searchResults.length > 0 ? (
                            searchResults.map(gift => (
                                <div key={gift.id} className="card search-results-card mb-3">
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <h5 className="card-title font-weight-bold">{gift.name}</h5>
                                            <p className="card-text mb-1"><strong>Category:</strong> {gift.category}</p>
                                            <p className="card-text mb-1"><strong>Condition:</strong> {gift.condition}</p>
                                            <p className="card-text mb-0 text-muted small">Age: {gift.age_years} years</p>
                                        </div>
                                        <button className="btn btn-outline-primary" onClick={() => goToDetailsPage(gift.id)}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info text-center" role="alert">
                                No products found. Please revise your filters or search query.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
