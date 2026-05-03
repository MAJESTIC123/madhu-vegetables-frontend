import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReviews } from '../api';
import Header from '../components/Header';
import '../styles/ReviewsPage.css';

function ReviewsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const result = await fetchReviews();
      setData(result);
    } catch (err) {
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Maximum count for percentage calculation
  const maxRatingCount = data?.ratingBreakdown 
    ? Math.max(...Object.values(data.ratingBreakdown), 1)
    : 1;

  return (
    <div className="reviews-page">
      <Header />
      
      <div className="reviews-container">
        <div className="reviews-header">
          <h1 className="reviews-title">⭐ Customer Reviews</h1>
          <p className="reviews-subtitle">வாடிக்கையாளர் கருத்துகள் / What our customers say</p>
        </div>

        {loading && (
          <div className="reviews-loading">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
          </div>
        )}

        {error && (
          <div className="reviews-error">
            <p>⚠️ {error}</p>
            <button onClick={loadReviews} className="retry-btn">Try Again</button>
          </div>
        )}

        {!loading && !error && data && (
          <>
            {data.totalReviews === 0 ? (
              <div className="no-reviews">
                <div className="no-reviews-icon">📝</div>
                <h2>No reviews yet!</h2>
                <p>இன்னும் கருத்துகள் இல்லை</p>
                <p className="no-reviews-text">
                  Be the first to share your experience with Madhu Vegetables!
                </p>
                <button onClick={() => navigate('/')} className="shop-now-btn">
                  🛒 Place Your First Order
                </button>
              </div>
            ) : (
              <>
                {/* Stats Section */}
                <div className="reviews-stats">
                  <div className="stats-overall">
                    <div className="overall-rating">{data.averageRating}</div>
                    <div className="overall-stars">
                      {renderStars(Math.round(data.averageRating))}
                    </div>
                    <p className="overall-count">
                      Based on {data.totalReviews} {data.totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>

                  <div className="stats-breakdown">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = data.ratingBreakdown[star] || 0;
                      const percentage = data.totalReviews > 0 
                        ? (count / data.totalReviews) * 100 
                        : 0;
                      
                      return (
                        <div key={star} className="breakdown-row">
                          <span className="breakdown-label">{star} ★</span>
                          <div className="breakdown-bar">
                            <div 
                              className="breakdown-fill"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="breakdown-count">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="reviews-list">
                  <h2 className="list-title">All Reviews</h2>
                  
                  {data.reviews.map((review, idx) => (
                    <div key={idx} className="review-card">
                      <div className="review-card-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="reviewer-details">
                            <h4 className="reviewer-name">{review.customerName}</h4>
                            <p className="review-date">{formatDate(review.createdAt)}</p>
                          </div>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <div className="reviews-cta">
          <p>நீங்களும் ஆர்டர் செய்து உங்கள் கருத்தை பகிருங்கள்!</p>
          <p>Place an order and share your experience!</p>
          <button onClick={() => navigate('/')} className="cta-btn">
            🛒 Order Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;