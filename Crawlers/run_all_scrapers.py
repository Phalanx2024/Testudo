import logging
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any
import time

# Import all scrapers
from scrapers.white_diamond_scraper import WhiteDiamondScraper
from scrapers.hunter_brook_scraper import HunterBrookScraper
from scrapers.logphase_scraper import LogPhaseScraper
from scrapers.culper_research_scraper import CulperScraper
from scrapers.scorpion_capital_scraper import ScorpionCapitalScraper
from scrapers.ningi_research_scraper import NingiResearchScraper
from scrapers.night_market_scraper import NightMarketScraper

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define scraper configurations
SCRAPER_CONFIGS = [
    {
        'name': 'White Diamond Research',
        'class': WhiteDiamondScraper
    },
    {
        'name': 'Hunter Brook Research',
        'class': HunterBrookScraper
    },
    {
        'name': 'Logphase Research',
        'class': LogPhaseScraper
    },
    {
        'name': 'Culper Research',
        'class': CulperScraper
    },
    {
        'name': 'Scorpion Capital',
        'class': ScorpionCapitalScraper
    },
    {
        'name': 'Ningi Research',
        'class': NingiResearchScraper
    },
    {
        'name': 'Night Market Research',
        'class': NightMarketScraper
    }
]

def run_scraper(config: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Run a single scraper and return its results
    """
    logger.info(f"Starting scraper for {config['name']}")
    try:
        scraper = config['class']()
        # Add retry logic
        max_retries = 3
        for attempt in range(max_retries):
            results = scraper.scrape()
            if results:
                logger.info(f"Successfully scraped {len(results)} reports from {config['name']}")
                return results
            else:
                logger.warning(f"Attempt {attempt + 1}/{max_retries}: No results found for {config['name']}, retrying...")
                if attempt < max_retries - 1:  # Don't sleep on last attempt
                    time.sleep(5)  # Wait 5 seconds between retries
        
        logger.error(f"All attempts failed for {config['name']}")
        return []
    except Exception as e:
        logger.error(f"Error running {config['name']} scraper: {str(e)}")
        return []

def run_all_scrapers(max_workers: int = 2) -> Dict[str, List[Dict[str, str]]]:
    """
    Run all scrapers in parallel using ThreadPoolExecutor
    
    Args:
        max_workers (int): Maximum number of parallel scraping tasks
        
    Returns:
        Dict[str, List[Dict[str, str]]]: Dictionary mapping scraper names to their results
    """
    # Reduce max_workers to avoid overwhelming resources
    all_results = {}
    
    # Group scrapers into batches to avoid overwhelming the system
    for i in range(0, len(SCRAPER_CONFIGS), max_workers):
        batch = SCRAPER_CONFIGS[i:i + max_workers]
        logger.info(f"Processing batch of {len(batch)} scrapers")
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_config = {
                executor.submit(run_scraper, config): config
                for config in batch
            }
            
            for future in future_to_config:
                config = future_to_config[future]
                try:
                    results = future.result()
                    all_results[config['name']] = results
                except Exception as e:
                    logger.error(f"Scraper {config['name']} failed with error: {str(e)}")
                    all_results[config['name']] = []
        
        # Add a small delay between batches
        if i + max_workers < len(SCRAPER_CONFIGS):
            time.sleep(2)
    
    return all_results

def main():
    """
    Main function to run all scrapers and display results
    """
    logger.info("Starting all scrapers")
    results = run_all_scrapers()
    
    # Print summary
    print("\nScraping Results Summary:")
    print("-" * 50)
    total_reports = 0
    for name, reports in results.items():
        num_reports = len(reports)
        total_reports += num_reports
        print(f"{name}: {num_reports} reports")

        # Print report details
        if num_reports > 0:
            print("\nLatest reports:")
            for report in reports[:3]:  # Show latest 3 reports
                print(f"- {getattr(report, 'date', 'No date')} | {getattr(report, 'title', 'No title')}")
            print()
    
    print("-" * 50)
    print(f"Total reports found: {total_reports}")

if __name__ == "__main__":
    main() 