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
            Short Activism
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-3xl">
            The activist space has become oversaturated, with low-quality publishers capitalizing on the credibility established by genuine and honest activists over the past decade.
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
              Market Analysis
            </h2>
            <p className="text-gray-600 mb-6">
              The sell-side reports responding to activist research are often superficial, uninformative, and lack credibility among investors, as they tend to be biased, non-independent assessments of short-sellers' analyses. At the same time, not all investors have the time, expertise, or resources to thoroughly evaluate the claims made by activist short-sellers—let alone do so within the tight window necessary to respond to an activist report.
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
            <p className="text-gray-600">
              Our services focus on informing and equipping clients with defense capabilities against activist short-selling, a relatively new phenomenon in financial markets. Many market participants may not be familiar with the strategies and tactics employed by short sellers, which can lead to challenges in assessing these activities in terms of professionalism and legality. We aim to provide the necessary insights and tools to navigate this complex landscape effectively.
            </p>
          </div>
        </div>
      </section>

      {/* Investor Defence Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className={`${lusitana.className} text-4xl font-bold text-center mb-16`}>
            Our Investor Defence Services
          </h2>
          
          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* AI Defence Advisory */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-2">AI Defence Advisory Service</h3>
              <p className="text-gray-600 mb-6">Strategic Corporate Guidance</p>
              <p className="text-2xl font-bold mb-6">£1,000</p>
              <button className="border border-gray-800 text-gray-800 px-6 py-2 rounded hover:bg-gray-800 hover:text-white transition-colors">
                View Course
              </button>
            </div>

            {/* Investor Dashboard */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-2">Investor Dashboard</h3>
              <p className="text-gray-600 mb-6">Dive Deep into Data</p>
              <p className="text-2xl font-bold mb-6">US$100</p>
              <button className="border border-gray-800 text-gray-800 px-6 py-2 rounded hover:bg-gray-800 hover:text-white transition-colors">
                View Course
              </button>
            </div>

            {/* Market Alerts */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-2">Market Alerts</h3>
              <p className="text-gray-600 mb-6">Stay Ahead in the Market</p>
              <p className="text-2xl font-bold mb-6">US$20</p>
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
              <h4 className="text-xl font-semibold mb-4">Predictive Analysis</h4>
              <p className="text-gray-600">
                Our monitoring services offer real-time insights into companies facing activist pressure, enabling investors to make informed decisions based on predictive analysis. We empower investors with the knowledge to anticipate market movements and take proactive measures.
              </p>
            </div>

            {/* Notification */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Notification</h3>
              <h4 className="text-xl font-semibold mb-4">Timely Alerts</h4>
              <p className="text-gray-600">
                Receive timely notifications about companies targeted by short seller activist hedge funds. Stay ahead of market trends and potential risks with our alert system, designed to keep you informed and prepared for market fluctuations.
              </p>
            </div>

            {/* Data Insights */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Data Insights</h3>
              <h4 className="text-xl font-semibold mb-4">Empowering Decisions</h4>
              <p className="text-gray-600">
                Access comprehensive data insights and analytics through our dashboard. Our focus on providing predictive insights for targeted companies equips retail investors with the tools they need to navigate the complex landscape of activist investing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="relative h-[400px]">
            <Image
              src="/about-bg.jpg"
              alt="About Us Background"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className={`${lusitana.className} text-4xl font-bold mb-8`}>
              About Us
            </h2>
            <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our team is trained out of JPMorgan. We specialize in monitoring and predicting companies targeted by activist hedge funds. Through our free email notification services and data insights dashboard, we empower retail investors by providing predictive analytics for targeted companies.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">BastionBridge</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 border-t border-gray-800 pt-8">
            <div>
              <p className="mb-2">123-456-7890</p>
              <p>info@mysite.com</p>
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
      </footer>
    </main>
  );
}