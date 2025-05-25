import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, FileText, Share2, Search, AlertCircle, Compass } from 'lucide-react';

const About: React.FC = () => {
  useEffect(() => {
    // Set page title
    document.title = 'About | Truth_Frame';
  }, []);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">About RockLens</h1>
        <p className="text-neutral-600">
          Understanding the technology and methodology behind our media bias analysis.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-neutral-600 mb-4">
              Truth_Frame was created to help people navigate today's complex media landscape by providing objective 
              analysis of news content. Our goal is not to tell you what to believe, but to help you recognize bias 
              and understand different perspectives on the same topics.
            </p>
            <p className="text-neutral-600 mb-4">
              We believe that being aware of the full spectrum of viewpoints leads to better-informed citizens
              and healthier democratic discourse. Our AI-powered tools aim to make media literacy accessible to
              everyone, regardless of their technical background or political affiliation.
            </p>
            <p className="text-neutral-600">
              By highlighting how different sources cover the same stories, we hope to encourage critical thinking
              and a more nuanced understanding of current events.
            </p>
          </div>
        </div>
        
        <div>
          <div className="card h-full">
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-medium">Article Analysis</h3>
                  <p className="text-sm text-neutral-600">
                    Evaluate individual articles for bias, sentiment, and key themes.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center mr-3">
                  <Share2 className="h-5 w-5 text-secondary-700" />
                </div>
                <div>
                  <h3 className="font-medium">Source Comparison</h3>
                  <p className="text-sm text-neutral-600">
                    Compare how different outlets cover the same topics.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center mr-3">
                  <Search className="h-5 w-5 text-accent-700" />
                </div>
                <div>
                  <h3 className="font-medium">Topic Search</h3>
                  <p className="text-sm text-neutral-600">
                    Find analysis on specific topics across the media landscape.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                  <BarChart2 className="h-5 w-5 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-medium">Trending Analysis</h3>
                  <p className="text-sm text-neutral-600">
                    Track how major stories are being covered in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Our Technology</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3">AI & Machine Learning</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Truth_Frame uses advanced natural language processing (NLP) and machine learning algorithms
              to analyze news content. Our technology examines multiple aspects of articles, including:
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1 mb-4">
              <li>Language patterns associated with political bias</li>
              <li>Emotional tone and sentiment</li>
              <li>Topic emphasis and framing</li>
              <li>Source selection and citation patterns</li>
              <li>Historical reporting trends by each outlet</li>
            </ul>
            <p className="text-neutral-600 text-sm">
              Our models are continuously trained on diverse datasets to ensure accuracy and fairness
              across the political spectrum.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Methodology</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Our bias analysis follows a rigorous methodology:
            </p>
            <ol className="list-decimal list-inside text-sm text-neutral-600 space-y-2">
              <li>
                <strong>Content Ingestion:</strong> Articles are collected from hundreds of sources across
                the political spectrum.
              </li>
              <li>
                <strong>Text Analysis:</strong> Our NLP engine breaks down articles into analyzable components.
              </li>
              <li>
                <strong>Multi-dimensional Scoring:</strong> Each article receives scores for bias, sentiment,
                objectivity, and topic relevance.
              </li>
              <li>
                <strong>Comparative Analysis:</strong> Stories on the same topic are compared across outlets
                to identify differences in coverage.
              </li>
              <li>
                <strong>Continuous Learning:</strong> Our models adapt based on expert review and new content.
              </li>
            </ol>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-warning-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-medium">Important Disclaimer</h3>
              <p className="text-sm text-neutral-600">
                While we strive for accuracy, our AI analysis should be considered a tool to aid critical
                thinking, not a definitive judgment. We encourage users to form their own opinions and
                consider multiple sources when evaluating news content.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">How to Use Truth_Frame</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-50 p-6 rounded-lg">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
              <span className="text-primary-700 text-xl font-bold">1</span>
            </div>
            <h3 className="font-medium mb-2">Get Started</h3>
            <p className="text-sm text-neutral-600 mb-3">
              Begin by exploring our dashboard to see trending topics and analysis.
              This will give you a sense of what's currently being covered in the media.
            </p>
            <Link to="/" className="text-sm text-primary-700 hover:text-primary-800 font-medium flex items-center">
              Go to Dashboard
              <Compass className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-secondary-50 p-6 rounded-lg">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary-100 mb-4">
              <span className="text-secondary-700 text-xl font-bold">2</span>
            </div>
            <h3 className="font-medium mb-2">Analyze Content</h3>
            <p className="text-sm text-neutral-600 mb-3">
              Use our article analysis feature to examine specific news stories that interest you.
              Enter the URL of any article to get an in-depth bias and sentiment analysis.
            </p>
            <Link to="/analyze" className="text-sm text-secondary-700 hover:text-secondary-800 font-medium flex items-center">
              Try Article Analysis
              <FileText className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-accent-50 p-6 rounded-lg">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent-100 mb-4">
              <span className="text-accent-700 text-xl font-bold">3</span>
            </div>
            <h3 className="font-medium mb-2">Compare Sources</h3>
            <p className="text-sm text-neutral-600 mb-3">
              For a broader view, use our comparison tool to see how different outlets cover the same topic.
              This helps identify different narratives and perspectives.
            </p>
            <Link to="/compare" className="text-sm text-accent-700 hover:text-accent-800 font-medium flex items-center">
              Compare Coverage
              <Share2 className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
          <h3 className="font-medium mb-2">Ready to explore different perspectives?</h3>
          <Link to="/analyze" className="btn btn-primary mt-2">
            Start Analyzing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;