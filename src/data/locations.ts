import type { Location, LocationHours } from './types';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/**
 * Builds a week of hours from a weekday pattern plus a late weekend pattern.
 * Times are typical for the market and are clearly labelled on the page as
 * general guidance — individual stores set their own hours.
 */
function week(
  weekday: [string, string],
  weekend: [string, string],
  sunday: [string, string] = weekday,
): LocationHours[] {
  return DAYS.map((day) => {
    if (day === 'Friday' || day === 'Saturday') {
      return { day, open: weekend[0], close: weekend[1] };
    }
    if (day === 'Sunday') return { day, open: sunday[0], close: sunday[1] };
    return { day, open: weekday[0], close: weekday[1] };
  });
}

export const locations: Location[] = [
  {
    city: 'New York',
    state: 'New York',
    stateCode: 'NY',
    slug: 'new-york-ny',
    title: 'New York, NY',
    description:
      'Delivery zones, carryout timing and price expectations for chain pizza across the five boroughs of New York City.',
    address: 'Midtown Manhattan service area, New York, NY 10018',
    phone: '(212) 555-0142',
    hours: week(['10:30', '00:00'], ['10:30', '01:00'], ['10:30', '23:00']),
    population: '8.3 million',
    storeCountNote: 'Dozens of locations across the five boroughs',
    neighborhoods: ['Midtown', 'Astoria', 'Park Slope', 'Harlem', 'Flushing'],
    latitude: 40.7549,
    longitude: -73.984,
  },
  {
    city: 'Los Angeles',
    state: 'California',
    stateCode: 'CA',
    slug: 'los-angeles-ca',
    title: 'Los Angeles, CA',
    description:
      'How delivery radius, freeway geography and late-night hours shape chain pizza ordering across Los Angeles.',
    address: 'Mid-Wilshire service area, Los Angeles, CA 90036',
    phone: '(213) 555-0188',
    hours: week(['10:00', '00:00'], ['10:00', '01:00'], ['10:00', '23:30']),
    population: '3.8 million',
    storeCountNote: 'Wide coverage across LA County',
    neighborhoods: ['Silver Lake', 'Koreatown', 'Venice', 'Highland Park', 'Sherman Oaks'],
    latitude: 34.0635,
    longitude: -118.3496,
  },
  {
    city: 'Chicago',
    state: 'Illinois',
    stateCode: 'IL',
    slug: 'chicago-il',
    title: 'Chicago, IL',
    description:
      'Chain pizza pricing, winter delivery timing and carryout strategy for Chicago and the near suburbs.',
    address: 'Near North Side service area, Chicago, IL 60610',
    phone: '(312) 555-0117',
    hours: week(['10:30', '23:30'], ['10:30', '01:00'], ['10:30', '23:00']),
    population: '2.7 million',
    storeCountNote: 'Dense coverage citywide plus the collar suburbs',
    neighborhoods: ['Logan Square', 'Hyde Park', 'Lakeview', 'Pilsen', 'Rogers Park'],
    latitude: 41.8985,
    longitude: -87.6323,
  },
  {
    city: 'Houston',
    state: 'Texas',
    stateCode: 'TX',
    slug: 'houston-tx',
    title: 'Houston, TX',
    description:
      'Delivery distances, storm-season disruption and value ordering for chain pizza across greater Houston.',
    address: 'Midtown service area, Houston, TX 77002',
    phone: '(713) 555-0163',
    hours: week(['10:30', '00:00'], ['10:30', '01:00'], ['10:30', '23:30']),
    population: '2.3 million',
    storeCountNote: 'Broad coverage across a very large metro footprint',
    neighborhoods: ['The Heights', 'Montrose', 'Katy', 'Sugar Land', 'Clear Lake'],
    latitude: 29.7433,
    longitude: -95.3763,
  },
  {
    city: 'Phoenix',
    state: 'Arizona',
    stateCode: 'AZ',
    slug: 'phoenix-az',
    title: 'Phoenix, AZ',
    description:
      'Summer heat, long delivery radii and the carryout maths that makes sense in the Phoenix metro.',
    address: 'Central Phoenix service area, Phoenix, AZ 85012',
    phone: '(602) 555-0129',
    hours: week(['10:30', '23:30'], ['10:30', '00:30'], ['10:30', '23:00']),
    population: '1.6 million',
    storeCountNote: 'Coverage across Phoenix, Tempe, Mesa and Scottsdale',
    neighborhoods: ['Arcadia', 'Tempe', 'Mesa', 'Scottsdale', 'Ahwatukee'],
    latitude: 33.5093,
    longitude: -112.0723,
  },
  {
    city: 'Philadelphia',
    state: 'Pennsylvania',
    stateCode: 'PA',
    slug: 'philadelphia-pa',
    title: 'Philadelphia, PA',
    description:
      'Row-house delivery quirks, campus-heavy demand and price expectations for chain pizza in Philadelphia.',
    address: 'Center City service area, Philadelphia, PA 19107',
    phone: '(215) 555-0174',
    hours: week(['10:30', '23:30'], ['10:30', '01:00'], ['10:30', '23:00']),
    population: '1.6 million',
    storeCountNote: 'Strong coverage in Center City and the university corridor',
    neighborhoods: ['Fishtown', 'University City', 'South Philly', 'Manayunk', 'Northern Liberties'],
    latitude: 39.9509,
    longitude: -75.1575,
  },
  {
    city: 'San Antonio',
    state: 'Texas',
    stateCode: 'TX',
    slug: 'san-antonio-tx',
    title: 'San Antonio, TX',
    description:
      'Loop-based delivery geography and family-bundle value for chain pizza in San Antonio.',
    address: 'Downtown service area, San Antonio, TX 78205',
    phone: '(210) 555-0135',
    hours: week(['10:30', '00:00'], ['10:30', '01:00'], ['10:30', '23:30']),
    population: '1.5 million',
    storeCountNote: 'Coverage inside and outside Loop 1604',
    neighborhoods: ['Alamo Heights', 'Stone Oak', 'Southtown', 'Medical Center', 'Helotes'],
    latitude: 29.4246,
    longitude: -98.4936,
  },
  {
    city: 'San Diego',
    state: 'California',
    stateCode: 'CA',
    slug: 'san-diego-ca',
    title: 'San Diego, CA',
    description:
      'Coastal traffic, canyon-split delivery zones and carryout timing across San Diego.',
    address: 'Hillcrest service area, San Diego, CA 92103',
    phone: '(619) 555-0151',
    hours: week(['10:30', '23:30'], ['10:30', '00:30'], ['10:30', '23:00']),
    population: '1.4 million',
    storeCountNote: 'Coverage from North County down to South Bay',
    neighborhoods: ['North Park', 'La Jolla', 'Chula Vista', 'Clairemont', 'Pacific Beach'],
    latitude: 32.7484,
    longitude: -117.1653,
  },
  {
    city: 'Dallas',
    state: 'Texas',
    stateCode: 'TX',
    slug: 'dallas-tx',
    title: 'Dallas, TX',
    description:
      'Delivery timing across a sprawling metroplex, plus which offers actually travel well in Dallas.',
    address: 'Uptown service area, Dallas, TX 75201',
    phone: '(214) 555-0198',
    hours: week(['10:30', '00:00'], ['10:30', '01:00'], ['10:30', '23:30']),
    population: '1.3 million',
    storeCountNote: 'Dense coverage across Dallas and the northern suburbs',
    neighborhoods: ['Bishop Arts', 'Deep Ellum', 'Plano', 'Richardson', 'Oak Lawn'],
    latitude: 32.7943,
    longitude: -96.8022,
  },
  {
    city: 'Austin',
    state: 'Texas',
    stateCode: 'TX',
    slug: 'austin-tx',
    title: 'Austin, TX',
    description:
      'Campus demand spikes, event-week delays and value ordering for chain pizza in Austin.',
    address: 'North Loop service area, Austin, TX 78751',
    phone: '(512) 555-0106',
    hours: week(['10:30', '00:00'], ['10:30', '01:00'], ['10:30', '23:30']),
    population: '975,000',
    storeCountNote: 'Coverage across central Austin and the suburban ring',
    neighborhoods: ['Hyde Park', 'South Congress', 'Mueller', 'Round Rock', 'Cedar Park'],
    latitude: 30.3132,
    longitude: -97.7256,
  },
  {
    city: 'Jacksonville',
    state: 'Florida',
    stateCode: 'FL',
    slug: 'jacksonville-fl',
    title: 'Jacksonville, FL',
    description:
      'River-split delivery zones, storm-season closures and carryout value in Jacksonville.',
    address: 'Riverside service area, Jacksonville, FL 32204',
    phone: '(904) 555-0122',
    hours: week(['10:30', '23:30'], ['10:30', '00:30'], ['10:30', '23:00']),
    population: '985,000',
    storeCountNote: 'Coverage on both banks of the St. Johns River',
    neighborhoods: ['Riverside', 'San Marco', 'Mandarin', 'Jacksonville Beach', 'Arlington'],
    latitude: 30.3161,
    longitude: -81.6906,
  },
  {
    city: 'Columbus',
    state: 'Ohio',
    stateCode: 'OH',
    slug: 'columbus-oh',
    title: 'Columbus, OH',
    description:
      'Game-day surges, student-heavy demand and how to time a chain pizza order in Columbus.',
    address: 'Short North service area, Columbus, OH 43215',
    phone: '(614) 555-0159',
    hours: week(['10:30', '23:30'], ['10:30', '01:00'], ['10:30', '23:00']),
    population: '915,000',
    storeCountNote: 'Heavy coverage near campus and the inner suburbs',
    neighborhoods: ['Short North', 'Clintonville', 'German Village', 'Dublin', 'Westerville'],
    latitude: 39.9793,
    longitude: -83.0044,
  },
  {
    city: 'Charlotte',
    state: 'North Carolina',
    stateCode: 'NC',
    slug: 'charlotte-nc',
    title: 'Charlotte, NC',
    description:
      'Suburban delivery distances, event-night demand and value bundles across Charlotte.',
    address: 'South End service area, Charlotte, NC 28203',
    phone: '(704) 555-0111',
    hours: week(['10:30', '23:30'], ['10:30', '00:30'], ['10:30', '23:00']),
    population: '900,000',
    storeCountNote: 'Coverage across Mecklenburg County and nearby towns',
    neighborhoods: ['South End', 'NoDa', 'Ballantyne', 'Plaza Midwood', 'University City'],
    latitude: 35.2119,
    longitude: -80.8654,
  },
  {
    city: 'Seattle',
    state: 'Washington',
    stateCode: 'WA',
    slug: 'seattle-wa',
    title: 'Seattle, WA',
    description:
      'Hills, bridges, apartment access and rain: what actually slows a Seattle pizza delivery.',
    address: 'Capitol Hill service area, Seattle, WA 98122',
    phone: '(206) 555-0193',
    hours: week(['10:30', '23:00'], ['10:30', '00:30'], ['10:30', '22:30']),
    population: '750,000',
    storeCountNote: 'Coverage across the city plus the Eastside',
    neighborhoods: ['Capitol Hill', 'Ballard', 'West Seattle', 'Fremont', 'Bellevue'],
    latitude: 47.6152,
    longitude: -122.3116,
  },
  {
    city: 'Denver',
    state: 'Colorado',
    stateCode: 'CO',
    slug: 'denver-co',
    title: 'Denver, CO',
    description:
      'Snow-day delivery reality, altitude-adjusted kitchen timing and value ordering in Denver.',
    address: 'Highland service area, Denver, CO 80211',
    phone: '(303) 555-0147',
    hours: week(['10:30', '23:30'], ['10:30', '00:30'], ['10:30', '23:00']),
    population: '715,000',
    storeCountNote: 'Coverage across Denver and the front-range suburbs',
    neighborhoods: ['Highland', 'Capitol Hill', 'Cherry Creek', 'Aurora', 'Lakewood'],
    latitude: 39.7615,
    longitude: -105.0119,
  },
  {
    city: 'Atlanta',
    state: 'Georgia',
    stateCode: 'GA',
    slug: 'atlanta-ga',
    title: 'Atlanta, GA',
    description:
      'Traffic-driven delivery windows, apartment-gate delays and bundle value across metro Atlanta.',
    address: 'Old Fourth Ward service area, Atlanta, GA 30312',
    phone: '(404) 555-0182',
    hours: week(['10:30', '00:00'], ['10:30', '01:00'], ['10:30', '23:30']),
    population: '500,000 city / 6.1 million metro',
    storeCountNote: 'Coverage inside and well outside the Perimeter',
    neighborhoods: ['Old Fourth Ward', 'Decatur', 'Buckhead', 'West End', 'Sandy Springs'],
    latitude: 33.7592,
    longitude: -84.3699,
  },
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export const locationSlugs = locations.map((l) => l.slug);

/** Groups cities by state for the /locations index. */
export function locationsByState(): { state: string; cities: Location[] }[] {
  const map = new Map<string, Location[]>();
  for (const loc of locations) {
    const list = map.get(loc.state) ?? [];
    list.push(loc);
    map.set(loc.state, list);
  }
  return [...map.entries()]
    .map(([state, cities]) => ({ state, cities }))
    .sort((a, b) => a.state.localeCompare(b.state));
}
