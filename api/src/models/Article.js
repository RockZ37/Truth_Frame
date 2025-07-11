const mongoose = require('mongoose');

// Sub-schemas
const FactCheckSchema = new mongoose.Schema({
  originalText: { type: String, required: true },
  claims: [{
    text: { type: String, required: true },
    claimant: { type: String },
    claimDate: { type: Date },
    rating: { type: String },
    url: { type: String },
    reviewPublisher: {
      name: { type: String },
      site: { type: String }
    },
    reviewDate: { type: Date },
    textualRating: { type: String },
    languageCode: { type: String, default: 'en' }
  }],
  relevance: { type: Number, min: 0, max: 1, default: 0 },
  verifiedAt: { type: Date, default: Date.now }
}, { _id: false });

const SourceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  domain: { type: String, required: true, lowercase: true, trim: true },
  reliability: { type: Number, min: 0, max: 1, default: 0.5 },
  favicon: { type: String },
  bias: {
    score: { type: Number, min: -1, max: 1, default: 0 },
    label: { type: String, enum: ['Left', 'Lean Left', 'Center', 'Lean Right', 'Right', 'Unknown'], default: 'Unknown' }
  }
}, { _id: false });

const EntitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  relevance: { type: Number, min: 0, max: 1 },
  sentiment: { type: Number, min: -1, max: 1 },
  mentions: { type: Number, default: 1 }
}, { _id: false });

const ThemeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  score: { type: Number, min: 0, max: 1 },
  keywords: [{ type: String }]
}, { _id: false });

const KeywordSchema = new mongoose.Schema({
  text: { type: String, required: true },
  relevance: { type: Number, min: 0, max: 1 },
  sentiment: { type: Number, min: -1, max: 1 },
  emotion: {
    sadness: { type: Number, min: 0, max: 1 },
    joy: { type: Number, min: 0, max: 1 },
    fear: { type: Number, min: 0, max: 1 },
    disgust: { type: Number, min: 0, max: 1 },
    anger: { type: Number, min: 0, max: 1 },
  }
}, { _id: false });

const AnalysisSchema = new mongoose.Schema({
  bias: {
    score: { type: Number, min: 0, max: 1, default: 0.5 },
    confidence: { type: Number, min: 0, max: 1, default: 0.5 },
    leaning: { 
      type: String, 
      enum: ['Left', 'Lean Left', 'Center', 'Lean Right', 'Right', 'Unknown'],
      default: 'Unknown' 
    },
  },
  sentiment: {
    positive: { type: Number, min: 0, max: 1, default: 0 },
    negative: { type: Number, min: 0, max: 1, default: 0 },
    neutral: { type: Number, min: 0, max: 1, default: 1 },
    overall: { type: Number, min: -1, max: 1, default: 0 },
    label: { 
      type: String, 
      enum: ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'],
      default: 'Neutral'
    }
  },
  keywords: [KeywordSchema],
  entities: [EntitySchema],
  themes: [ThemeSchema],
  factChecks: [FactCheckSchema],
  politicalLeaning: {
    score: { type: Number, min: -1, max: 1, default: 0 },
    confidence: { type: Number, min: 0, max: 1, default: 0 },
    parties: [{
      name: String,
      score: { type: Number, min: -1, max: 1 }
    }]
  },
  readability: {
    score: { type: Number, min: 0, max: 100 },
    gradeLevel: { type: String },
    readingTime: { type: Number } // in minutes
  },
  stats: {
    wordCount: { type: Number, default: 0 },
    sentenceCount: { type: Number, default: 0 },
    avgSentenceLength: { type: Number, default: 0 },
    avgWordLength: { type: Number, default: 0 }
  }
}, { _id: false });

const ArticleSchema = new mongoose.Schema({
  // Core article data
  url: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: v => {
        try {
          new URL(v);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  title: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 10,
    maxlength: 500,
    index: 'text' 
  },
  source: SourceSchema,
  author: { 
    type: String, 
    required: true,
    trim: true
  },
  publishedDate: { 
    type: Date, 
    required: true, 
    index: -1 
  },
  updatedDate: { 
    type: Date,
    default: function() { return this.publishedDate; }
  },
  content: { 
    type: String, 
    required: true,
    minlength: 100
  },
  snippet: { 
    type: String, 
    required: true,
    maxlength: 300
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ar', 'hi'],
    index: true
  },
  
  // Media
  image: {
    url: String,
    caption: String,
    credit: String
  },
  
  // Vector embeddings for semantic search
  embedding: {
    type: [Number],
    default: undefined,
    validate: {
      validator: v => !v || (Array.isArray(v) && v.length === 1536), // OpenAI embedding size
      message: 'Embedding must be an array of 1536 numbers'
    }
  },
  
  // Analysis and metadata
  status: {
    type: String,
    enum: ['pending', 'processing', 'analyzed', 'error'],
    default: 'pending',
    index: true
  },
  analyzedAt: { 
    type: Date, 
    default: null 
  },
  lastFactChecked: { 
    type: Date, 
    default: null 
  },
  
  // Analysis results
  analysis: AnalysisSchema,
  
  // Tags and categories
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    index: true
  }],
  categories: [{
    type: String,
    trim: true,
    index: true
  }],
  
  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.embedding; // Don't expose embeddings by default
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  optimisticConcurrency: true
});

// Virtual for article URL
ArticleSchema.virtual('urlPath').get(function() {
  return `/articles/${this._id}`;
});

// Virtual for reading time
ArticleSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const words = this.content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
});

// Pre-save hook to update timestamps and extract metadata
ArticleSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.updatedDate = new Date();
    this.analysis.stats = this.calculateReadability();
  }
  next();
});

// Add text search index
ArticleSchema.index({
  title: 'text',
  content: 'text',
  'analysis.keywords.text': 'text',
  'analysis.themes.label': 'text',
  'analysis.entities.name': 'text'
});

// Add compound indexes for common queries
ArticleSchema.index({ 'source.domain': 1, publishedDate: -1 });
ArticleSchema.index({ 'analysis.bias.leaning': 1, publishedDate: -1 });
ArticleSchema.index({ 'analysis.sentiment.label': 1, publishedDate: -1 });
ArticleSchema.index({ 'analysis.politicalLeaning.score': 1, publishedDate: -1 });

// Add TTL index for auto-expiring temporary articles
ArticleSchema.index(
  { createdAt: 1 },
  { 
    expireAfterSeconds: 60 * 60 * 24 * 7, // 7 days
    partialFilterExpression: { isTemporary: true }
  }
);

// Add 2dsphere index for geospatial queries (if needed)
// ArticleSchema.index({ location: '2dsphere' });

// Add vector search index for semantic search
ArticleSchema.index(
  { embedding: 'knnVector' },
  {
    name: 'semantic_search_index',
    knnVectorOptions: {
      dimensions: 1536, // OpenAI embedding size
      similarity: 'cosine'
    }
  }
);

// Instance methods
ArticleSchema.methods = {
  // Calculate reading statistics
  calculateReadability() {
    const words = this.content.split(/\s+/);
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const avgSentenceLength = wordCount / (sentenceCount || 1);
    const avgWordLength = words.join('').length / (wordCount || 1);
    
    // Simple Flesch-Kincaid Reading Ease score
    const score = Math.max(0, Math.min(100, 
      206.835 - 1.015 * (wordCount / (sentenceCount || 1)) - 84.6 * (words.join('').length / wordCount)
    ));
    
    // Convert score to grade level
    const gradeLevel = this.getGradeLevel(score);
    
    return {
      wordCount,
      sentenceCount,
      avgSentenceLength: parseFloat(avgSentenceLength.toFixed(2)),
      avgWordLength: parseFloat(avgWordLength.toFixed(2)),
      readingEase: parseFloat(score.toFixed(1)),
      gradeLevel
    };
  },
  
  // Map reading ease score to grade level
  getGradeLevel(score) {
    if (score >= 90) return '5th grade';
    if (score >= 80) return '6th grade';
    if (score >= 70) return '7th grade';
    if (score >= 60) return '8th-9th grade';
    if (score >= 50) return '10th-12th grade';
    if (score >= 30) return 'College';
    return 'College Graduate';
  },
  
  // Generate a summary of the article
  generateSummary(maxLength = 300) {
    if (this.content.length <= maxLength) return this.content;
    
    // Simple implementation - could be enhanced with NLP
    const sentences = this.content.split(/(?<=[.!?])\s+/);
    let summary = '';
    
    for (const sentence of sentences) {
      if ((summary + sentence).length > maxLength) break;
      summary += sentence + ' ';
    }
    
    return summary.trim() + (summary.length < this.content.length ? '...' : '');
  },
  
  // Check if article needs re-analysis
  needsReanalysis() {
    if (!this.analyzedAt) return true;
    
    // Re-analyze if content has changed significantly
    const contentChanged = this.isModified('content') && 
      this.getChanges().content?.length > this.content.length * 0.1; // More than 10% change
    
    // Re-analyze if it's been more than a month
    const staleAnalysis = (new Date() - this.analyzedAt) > 30 * 24 * 60 * 60 * 1000;
    
    return contentChanged || staleAnalysis;
  }
};

// Static methods
ArticleSchema.statics = {
  // Find similar articles using vector search
  async findSimilar(articleId, limit = 5) {
    const article = await this.findById(articleId).select('embedding');
    if (!article || !article.embedding) return [];
    
    return this.aggregate([
      {
        $vectorSearch: {
          index: 'semantic_search_index',
          path: 'embedding',
          queryVector: article.embedding,
          numCandidates: 100,
          limit: limit + 1, // +1 to exclude self
        },
      },
      { $match: { _id: { $ne: article._id } } }, // Exclude self
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          snippet: 1,
          source: 1,
          publishedDate: 1,
          'analysis.bias': 1,
          'analysis.sentiment': 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]);
  },
  
  // Get statistics about the article collection
  async getStats() {
    return {
      total: await this.countDocuments(),
      bySource: await this.aggregate([
        { $group: { _id: '$source.domain', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      byBias: await this.aggregate([
        { 
          $group: { 
            _id: '$analysis.bias.leaning', 
            count: { $sum: 1 },
            avgSentiment: { $avg: '$analysis.sentiment.overall' }
          } 
        },
        { $sort: { count: -1 } }
      ]),
      byDate: await this.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$publishedDate' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ])
    };
  },
  
  // Search articles with text and filters
  async search({ query, filters = {}, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const match = {};
    
    // Text search
    if (query) {
      match.$text = { $search: query };
    }
    
    // Apply filters
    if (filters.source) {
      match['source.domain'] = filters.source;
    }
    if (filters.startDate || filters.endDate) {
      match.publishedDate = {};
      if (filters.startDate) {
        match.publishedDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        match.publishedDate.$lte = new Date(filters.endDate);
      }
    }
    if (filters.bias?.length) {
      match['analysis.bias.leaning'] = { $in: filters.bias };
    }
    if (filters.sentiment?.length) {
      match['analysis.sentiment.label'] = { $in: filters.sentiment };
    }
    
    const [results, total] = await Promise.all([
      this.find(match)
        .sort({ publishedDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.countDocuments(match)
    ]);
    
    return {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
};

// Create and export the model
const Article = mongoose.model('Article', ArticleSchema);

module.exports = { Article };