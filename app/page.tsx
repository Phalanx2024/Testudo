import TestudoLogo from '@/app/ui/testudo-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black opacity-90">
          <Image
            src="/market-bg.jpg"
            alt="Market Background"
            fill
            className="object-cover mix-blend-overlay"
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className={`${lusitana.className} text-5xl md:text-7xl font-bold mb-6 text-center`}>
            The Short Seller Activist Universe at Your Fingertips
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-3xl">
          Gain exclusive access to thousands of short thesis reports and stay ahead with real-time notifications on the latest activist campaigns. Our AI-driven models analyze and assess reports instantly, providing low-correlation insights to market indices—giving you the edge to protect your portfolio or capitalize on emerging opportunities in overpriced equities.
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Explore Dashboard
            </Link>
            <Link
              href="/login"
              className="border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Market Analysis Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className={`${lusitana.className} text-3xl font-bold mb-6`}>
              What Are Short Seller Activists?
            </h2>
            <p className="text-gray-600 mb-6">
            Short seller activists are investors or hedge funds that take short positions in a stock and publicly challenge a company's financial health, business practices, or market valuation. They often publish detailed reports exposing alleged fraud, overvaluation, or corporate misconduct, aiming to drive stock prices lower.
            While short seller activism can uncover real financial risks, it can also create volatility, misinformation, or trading opportunities. Testudo helps you navigate this landscape by providing real-time alerts and AI-powered insights into activist campaigns.       
              {/* The sell-side reports responding to activist research are often superficial, uninformative, and lack credibility among investors, as they tend to be biased, non-independent assessments of short-sellers' analyses. At the same time, not all investors have the time, expertise, or resources to thoroughly evaluate the claims made by activist short-sellers—let alone do so within the tight window necessary to respond to an activist report. */}
            
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <Image
                src="/chart.png"
                alt="Industry Distribution Chart"
                width={500}
                height={300}
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <Image
                src="/graph.png"
                alt="Historical Trend Graph"
                width={500}
                height={300}
                className="w-full"
              />
            </div>
            <h2 className={`${lusitana.className} text-3xl font-bold mb-6`}>
              Short Seller Activism is Rising?
            </h2>
            <p className="text-gray-600">
            With the rise of social media, the influence of short seller activists and their hedge funds is growing. But how do you separate valuable insights from market noise?
            Testudo empowers investors, hedge funds, and enterprises with a comprehensive database of short activist reports. Using advanced machine learning, we analyze and compare new reports against tens of thousands of historical theses, helping you identify high-impact campaigns in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Why Testudo Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className={`${lusitana.className} text-4xl font-bold text-center mb-16`}>
            Why Testudo?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Testudo is purpose-built for activist short selling – not a generic news scanner. We offer low-correlation, high-value insights that complement traditional research.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold mb-4">Unique Low-Correlation Data</h3>
                <p className="text-gray-600">
                  Our sources span international filings, niche forums and deep-web channels that most vendors miss. This non-consensus intelligence typically has low correlation to market noise, giving your strategy a true edge.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold mb-4">Ultra-Fast Detection</h3>
                <p className="text-gray-600">
                  Testudo processes massive data streams in real time. In practice, our platform ingests news and social data within milliseconds, enabling you to monitor real-time conditions, seize market opportunities, and negate threats faster than manual methods.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold mb-4">Predictive Intelligence</h3>
                <p className="text-gray-600">
                  By learning from historical patterns, Testudo's AI can anticipate likely targets before headlines break. Our predictive risk scores help you identify which companies are most vulnerable to activist attention in the near future.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold mb-4">Expert Coverage</h3>
                <p className="text-gray-600">
                  Every activist short seller is profiled and tracked. From veteran firms to up-and-coming reporters, Testudo covers their every move. This breadth of coverage – combined with depth of analysis – ensures no campaign slips through unnoticed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investor Defence Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className={`${lusitana.className} text-4xl font-bold text-center mb-16`}>
            Short Seller Activist Services
          </h2>
          
          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* AI Defence Advisory */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-2">AI Defence Advisory Service</h3>
              <p className="text-gray-600 mb-6">Strategic Corporate Guidance</p>
              <p className="text-2xl font-bold mb-6"> --- </p>
              <button className="border border-gray-800 text-gray-800 px-6 py-2 rounded hover:bg-gray-800 hover:text-white transition-colors">
                View Course
              </button>
            </div>

            {/* Investor Dashboard */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-2">Investor Dashboard</h3>
              <p className="text-gray-600 mb-6">Dive Deep into Data</p>
              <p className="text-2xl font-bold mb-6"> --- </p>
              <button className="border border-gray-800 text-gray-800 px-6 py-2 rounded hover:bg-gray-800 hover:text-white transition-colors">
                View Course
              </button>
            </div>

            {/* Market Alerts */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-2">Market Alerts</h3>
              <p className="text-gray-600 mb-6">Stay Ahead in the Market</p>
              <p className="text-2xl font-bold mb-6"> --- </p>
              <button className="border border-gray-800 text-gray-800 px-6 py-2 rounded hover:bg-gray-800 hover:text-white transition-colors">
                View Course
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-12">
            {/* Monitoring */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Monitoring</h3>
              <h4 className="text-xl font-semibold mb-4">AI-Driven Analysis:</h4>
              <p className="text-gray-600">
              Advanced machine learning models sift through news, filings, social chatter and more to surface campaign signals. "Leverage AI-driven analytics to identify market opportunities before the competition" – meaning Testudo spots anomalies and sentiment shifts that hint at a brewing short attack.

              </p>
            </div>

            {/* Notification */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Notification</h3>
              <h4 className="text-xl font-semibold mb-4">Real-Time Alerts:</h4>
              <p className="text-gray-600">
              Automated notifications (email, SMS or in-app) trigger the moment a new short-seller report or rumor appears. With 24/7 monitoring, you gain time to react even when teams are offline.
              </p>
              <p className="text-gray-600">
              Search a complete database of past short-selling campaigns and research reports. Analyze how targets behaved, review report dates and performance, and backtest your strategies using real case studies.
              </p>

            </div>

            {/* Data Insights */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Data Insights</h3>
              <h4 className="text-xl font-semibold mb-4">Empowering Decisions</h4>
              <p className="text-gray-600">
              Access detailed dossiers on every prominent short seller. Understand each activist's history, tactics and past campaign outcomes, so you know what to expect when they target a stock.
              </p>
             <p className="text-gray-600">
              Plug Testudo into your existing infrastructure. Our RESTful API delivers real-time signals and raw data into your dashboards, models or data lake, so you can programmatically incorporate our intelligence into workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section with Footer */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black opacity-90">
          <Image
            src="/about-bg.jpg"
            alt="About Us Background"
            fill
            className="object-cover mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="p-12 text-white">
            <h2 className={`${lusitana.className} text-4xl font-bold mb-8`}>
              About Us
            </h2>
            <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
            <p className="text-lg leading-relaxed max-w-2xl mb-20">
              Our team is trained out of JPMorgan. We specialize in monitoring and predicting companies targeted by activist hedge funds. Through our free email notification services and data insights dashboard, we empower retail investors by providing predictive analytics for targeted companies.
            </p>

            {/* Footer Content */}
            {/* <div className="border-t border-white/20 pt-8">
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4">BastionBridge</h2>
              </div>
               */}
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="mb-2">123-456-7890</p>
                  <p>phalanx2024@gmail.com</p>
                </div>
                <div>
                  <p className="mb-2">London,</p>
                  <p>United Kingdom</p>
                </div>
                <div className="flex gap-4">
                  {/* Add social media icons if needed */}
                </div>
              </div>
            </div>
          </div>
      </section>
    </main>
  );
}