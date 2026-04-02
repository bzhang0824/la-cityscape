// Mock data for LA Cityscape frontend demo

export interface Permit {
  permit_nbr: string;
  primary_address: string;
  permit_type: string;
  permit_sub_type: string;
  issue_date: string;
  valuation: number;
  status_desc: string;
  zone: string;
  council_district: number;
  community_plan_area: string;
  contractor: string;
  lat: number;
  lon: number;
}

export interface PlanningCase {
  case_number: string;
  address: string;
  case_type: string;
  filing_date: string;
  project_description: string;
  council_district: number;
  community_plan_area: string;
  status: string;
  lat: number;
  lon: number;
}

export interface Place {
  slug: string;
  name: string;
  type: 'council_district' | 'community_plan_area';
  permit_count: number;
  planning_case_count: number;
  top_permit_type: string;
  lat: number;
  lon: number;
}

export const permits: Permit[] = [
  { permit_nbr: 'BLD-2025-00142', primary_address: '6255 W Sunset Blvd', permit_type: 'Building', permit_sub_type: 'New Construction', issue_date: '2025-12-15', valuation: 4500000, status_desc: 'Issued', zone: 'C4-2D-SN', council_district: 13, community_plan_area: 'Hollywood', contractor: 'Turner Construction', lat: 34.0982, lon: -118.3248 },
  { permit_nbr: 'BLD-2025-00287', primary_address: '800 S Figueroa St', permit_type: 'Building', permit_sub_type: 'Commercial Alteration', issue_date: '2025-11-22', valuation: 12000000, status_desc: 'Issued', zone: 'C2-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'AECOM', lat: 34.0445, lon: -118.2614 },
  { permit_nbr: 'ELE-2025-01892', primary_address: '1500 N Cahuenga Blvd', permit_type: 'Electrical', permit_sub_type: 'Panel Upgrade', issue_date: '2025-12-01', valuation: 28000, status_desc: 'Issued', zone: 'C4-2D-SN', council_district: 13, community_plan_area: 'Hollywood', contractor: 'Voltage Electric', lat: 34.0995, lon: -118.3288 },
  { permit_nbr: 'BLD-2025-00301', primary_address: '10880 Wilshire Blvd', permit_type: 'Building', permit_sub_type: 'Tenant Improvement', issue_date: '2025-12-10', valuation: 950000, status_desc: 'Issued', zone: 'C2-1VL', council_district: 5, community_plan_area: 'Westwood', contractor: 'Skanska USA', lat: 34.0589, lon: -118.4421 },
  { permit_nbr: 'PLM-2025-00534', primary_address: '4567 W Adams Blvd', permit_type: 'Plumbing', permit_sub_type: 'Repipe', issue_date: '2025-11-18', valuation: 15000, status_desc: 'Issued', zone: 'R2-1', council_district: 10, community_plan_area: 'West Adams', contractor: 'Pacific Plumbing', lat: 34.0307, lon: -118.3183 },
  { permit_nbr: 'BLD-2025-00456', primary_address: '3780 Wilshire Blvd', permit_type: 'Building', permit_sub_type: 'New Construction', issue_date: '2025-10-30', valuation: 78000000, status_desc: 'Under Construction', zone: 'C2-2', council_district: 10, community_plan_area: 'Wilshire', contractor: 'Webcor Builders', lat: 34.0619, lon: -118.3089 },
  { permit_nbr: 'MEC-2025-00789', primary_address: '2020 Avenue of the Stars', permit_type: 'Mechanical', permit_sub_type: 'HVAC Replace', issue_date: '2025-11-05', valuation: 185000, status_desc: 'Issued', zone: 'C2-2-O', council_district: 5, community_plan_area: 'Century City', contractor: 'Air-Rite HVAC', lat: 34.0559, lon: -118.4143 },
  { permit_nbr: 'BLD-2025-00523', primary_address: '333 S Alameda St', permit_type: 'Building', permit_sub_type: 'Mixed Use', issue_date: '2025-10-15', valuation: 45000000, status_desc: 'Under Construction', zone: 'M2-2D', council_district: 14, community_plan_area: 'Central City North', contractor: 'Clark Construction', lat: 34.0462, lon: -118.2376 },
  { permit_nbr: 'GRD-2025-00102', primary_address: '19000 Mulholland Dr', permit_type: 'Grading', permit_sub_type: 'Hillside Grading', issue_date: '2025-09-28', valuation: 320000, status_desc: 'Issued', zone: 'RE40-1-H', council_district: 3, community_plan_area: 'Bel Air-Beverly Crest', contractor: 'Grading Solutions Inc', lat: 34.1228, lon: -118.4468 },
  { permit_nbr: 'BLD-2025-00678', primary_address: '1111 S Grand Ave', permit_type: 'Building', permit_sub_type: 'High-Rise Residential', issue_date: '2025-11-20', valuation: 125000000, status_desc: 'Plan Check', zone: 'C2-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Suffolk Construction', lat: 34.0402, lon: -118.2625 },
  { permit_nbr: 'ELE-2025-02100', primary_address: '6801 Hollywood Blvd', permit_type: 'Electrical', permit_sub_type: 'Signage Electrical', issue_date: '2025-12-05', valuation: 42000, status_desc: 'Issued', zone: 'C4-2D-SN', council_district: 13, community_plan_area: 'Hollywood', contractor: 'Neon Electric Co', lat: 34.1017, lon: -118.3385 },
  { permit_nbr: 'BLD-2025-00712', primary_address: '5900 Wilshire Blvd', permit_type: 'Building', permit_sub_type: 'Museum Renovation', issue_date: '2025-08-15', valuation: 35000000, status_desc: 'Under Construction', zone: 'C2-1', council_district: 5, community_plan_area: 'Wilshire', contractor: 'Hensel Phelps', lat: 34.0627, lon: -118.3555 },
  { permit_nbr: 'PLM-2025-00601', primary_address: '742 N Highland Ave', permit_type: 'Plumbing', permit_sub_type: 'Water Heater', issue_date: '2025-12-12', valuation: 8500, status_desc: 'Issued', zone: 'R1-1', council_district: 13, community_plan_area: 'Hollywood', contractor: 'Quick Fix Plumbing', lat: 34.0845, lon: -118.3382 },
  { permit_nbr: 'BLD-2025-00834', primary_address: '10250 Santa Monica Blvd', permit_type: 'Building', permit_sub_type: 'Retail Build-Out', issue_date: '2025-11-01', valuation: 2800000, status_desc: 'Issued', zone: 'C2-1VL', council_district: 5, community_plan_area: 'Century City', contractor: 'Hathaway Dinwiddie', lat: 34.0603, lon: -118.4198 },
  { permit_nbr: 'BLD-2025-00901', primary_address: '727 W 7th St', permit_type: 'Building', permit_sub_type: 'Adaptive Reuse', issue_date: '2025-09-10', valuation: 8500000, status_desc: 'Under Construction', zone: 'C5-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Bernards', lat: 34.0488, lon: -118.2574 },
  { permit_nbr: 'MEC-2025-00912', primary_address: '350 S Grand Ave', permit_type: 'Mechanical', permit_sub_type: 'Elevator Modernization', issue_date: '2025-10-20', valuation: 520000, status_desc: 'Issued', zone: 'C2-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Kone Elevators', lat: 34.0522, lon: -118.2545 },
  { permit_nbr: 'BLD-2025-01001', primary_address: '8500 Beverly Blvd', permit_type: 'Building', permit_sub_type: 'Medical Office', issue_date: '2025-11-28', valuation: 6200000, status_desc: 'Issued', zone: 'C2-1VL', council_district: 5, community_plan_area: 'Wilshire', contractor: 'McCarthy Building', lat: 34.0736, lon: -118.3737 },
  { permit_nbr: 'ELE-2025-02234', primary_address: '100 N La Cienega Blvd', permit_type: 'Electrical', permit_sub_type: 'EV Charger Install', issue_date: '2025-12-08', valuation: 65000, status_desc: 'Issued', zone: 'C2-1VL', council_district: 5, community_plan_area: 'Wilshire', contractor: 'ChargePoint Contractors', lat: 34.0705, lon: -118.3767 },
  { permit_nbr: 'BLD-2025-01102', primary_address: '3900 S Figueroa St', permit_type: 'Building', permit_sub_type: 'Stadium Renovation', issue_date: '2025-07-20', valuation: 250000000, status_desc: 'Under Construction', zone: 'OS-1XL', council_district: 9, community_plan_area: 'South Los Angeles', contractor: 'PCL Construction', lat: 34.0141, lon: -118.2879 },
  { permit_nbr: 'BLD-2025-01203', primary_address: '12100 W Olympic Blvd', permit_type: 'Building', permit_sub_type: 'Multi-Family Residential', issue_date: '2025-10-05', valuation: 18000000, status_desc: 'Plan Check', zone: 'C2-1VL', council_district: 11, community_plan_area: 'West Los Angeles', contractor: 'Lendlease', lat: 34.0325, lon: -118.4370 },
  { permit_nbr: 'GRD-2025-00145', primary_address: '2600 N Beachwood Dr', permit_type: 'Grading', permit_sub_type: 'Retaining Wall', issue_date: '2025-11-15', valuation: 175000, status_desc: 'Issued', zone: 'R1-1-HPOZ', council_district: 4, community_plan_area: 'Hollywood', contractor: 'Hillside Grading Corp', lat: 34.1198, lon: -118.3200 },
  { permit_nbr: 'BLD-2025-01304', primary_address: '4725 S Broadway', permit_type: 'Building', permit_sub_type: 'Affordable Housing', issue_date: '2025-09-22', valuation: 32000000, status_desc: 'Under Construction', zone: 'C2-2D', council_district: 9, community_plan_area: 'South Los Angeles', contractor: 'Swinerton', lat: 34.0040, lon: -118.2780 },
  { permit_nbr: 'PLM-2025-00710', primary_address: '1800 N Vine St', permit_type: 'Plumbing', permit_sub_type: 'Sewer Line Repair', issue_date: '2025-12-02', valuation: 22000, status_desc: 'Issued', zone: 'C4-2D-SN', council_district: 13, community_plan_area: 'Hollywood', contractor: 'Roto-Rooter LA', lat: 34.1044, lon: -118.3265 },
  { permit_nbr: 'BLD-2025-01405', primary_address: '9255 W Sunset Blvd', permit_type: 'Building', permit_sub_type: 'Hotel Renovation', issue_date: '2025-08-30', valuation: 15000000, status_desc: 'Under Construction', zone: 'C4-1VL', council_district: 4, community_plan_area: 'Hollywood', contractor: 'Peck/Jones Construction', lat: 34.0905, lon: -118.3850 },
  { permit_nbr: 'BLD-2025-01506', primary_address: '1950 N Highland Ave', permit_type: 'Building', permit_sub_type: 'New Construction', issue_date: '2025-10-18', valuation: 22000000, status_desc: 'Plan Check', zone: 'PB-2', council_district: 13, community_plan_area: 'Hollywood', contractor: 'DPR Construction', lat: 34.1050, lon: -118.3383 },
  { permit_nbr: 'ELE-2025-02456', primary_address: '700 Flower St', permit_type: 'Electrical', permit_sub_type: 'Office Rewire', issue_date: '2025-11-10', valuation: 95000, status_desc: 'Issued', zone: 'C2-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Cal Electric Inc', lat: 34.0492, lon: -118.2600 },
  { permit_nbr: 'BLD-2025-01607', primary_address: '5300 Beethoven St', permit_type: 'Building', permit_sub_type: 'Single Family Dwelling', issue_date: '2025-11-25', valuation: 1800000, status_desc: 'Issued', zone: 'R1-1', council_district: 11, community_plan_area: 'Palms-Mar Vista-Del Rey', contractor: 'Thomas James Homes', lat: 33.9920, lon: -118.4350 },
  { permit_nbr: 'MEC-2025-01023', primary_address: '6060 Center Dr', permit_type: 'Mechanical', permit_sub_type: 'HVAC System', issue_date: '2025-12-03', valuation: 340000, status_desc: 'Issued', zone: 'C2-2', council_district: 11, community_plan_area: 'West Los Angeles', contractor: 'Johnson Controls', lat: 34.0486, lon: -118.3962 },
  { permit_nbr: 'BLD-2025-01708', primary_address: '453 S Spring St', permit_type: 'Building', permit_sub_type: 'Loft Conversion', issue_date: '2025-09-05', valuation: 5600000, status_desc: 'Issued', zone: 'C5-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Level 10 Construction', lat: 34.0487, lon: -118.2487 },
  { permit_nbr: 'BLD-2025-01809', primary_address: '14006 Riverside Dr', permit_type: 'Building', permit_sub_type: 'Restaurant Build-Out', issue_date: '2025-10-28', valuation: 450000, status_desc: 'Issued', zone: 'C2-1VL', council_district: 4, community_plan_area: 'Sherman Oaks', contractor: 'Interior Build Co', lat: 34.1510, lon: -118.4268 },
  { permit_nbr: 'PLM-2025-00845', primary_address: '3250 Wilshire Blvd', permit_type: 'Plumbing', permit_sub_type: 'Fire Sprinkler', issue_date: '2025-11-30', valuation: 145000, status_desc: 'Issued', zone: 'C2-2', council_district: 10, community_plan_area: 'Wilshire', contractor: 'FireSafe Sprinklers', lat: 34.0624, lon: -118.2984 },
  { permit_nbr: 'BLD-2025-01910', primary_address: '7100 Santa Monica Blvd', permit_type: 'Building', permit_sub_type: 'Mixed Use', issue_date: '2025-08-20', valuation: 28000000, status_desc: 'Under Construction', zone: 'C2-1VL', council_district: 4, community_plan_area: 'Hollywood', contractor: 'Morley Builders', lat: 34.0907, lon: -118.3440 },
  { permit_nbr: 'ELE-2025-02678', primary_address: '3055 Wilshire Blvd', permit_type: 'Electrical', permit_sub_type: 'Solar Panel Install', issue_date: '2025-12-14', valuation: 78000, status_desc: 'Issued', zone: 'C2-2', council_district: 10, community_plan_area: 'Wilshire', contractor: 'SunPower LA', lat: 34.0630, lon: -118.2934 },
  { permit_nbr: 'BLD-2025-02011', primary_address: '11500 San Vicente Blvd', permit_type: 'Building', permit_sub_type: 'Condo Renovation', issue_date: '2025-10-12', valuation: 3200000, status_desc: 'Issued', zone: 'R3-1', council_district: 11, community_plan_area: 'Brentwood', contractor: 'W.E. O\'Neil Construction', lat: 34.0527, lon: -118.4672 },
  { permit_nbr: 'BLD-2025-02112', primary_address: '888 S Hope St', permit_type: 'Building', permit_sub_type: 'Office Tower', issue_date: '2025-07-15', valuation: 180000000, status_desc: 'Under Construction', zone: 'C2-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Turner Construction', lat: 34.0460, lon: -118.2590 },
  { permit_nbr: 'GRD-2025-00198', primary_address: '3100 N Beverly Glen Blvd', permit_type: 'Grading', permit_sub_type: 'Site Preparation', issue_date: '2025-09-15', valuation: 890000, status_desc: 'Issued', zone: 'RE15-1-H', council_district: 5, community_plan_area: 'Bel Air-Beverly Crest', contractor: 'A&A Grading Inc', lat: 34.1145, lon: -118.4390 },
  { permit_nbr: 'BLD-2025-02213', primary_address: '400 S Broadway', permit_type: 'Building', permit_sub_type: 'Adaptive Reuse', issue_date: '2025-10-01', valuation: 14000000, status_desc: 'Under Construction', zone: 'C5-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Walsh Construction', lat: 34.0501, lon: -118.2490 },
  { permit_nbr: 'MEC-2025-01145', primary_address: '1100 Glendon Ave', permit_type: 'Mechanical', permit_sub_type: 'Boiler Replacement', issue_date: '2025-11-08', valuation: 210000, status_desc: 'Issued', zone: 'C2-1VL', council_district: 5, community_plan_area: 'Westwood', contractor: 'Pacific Mechanical', lat: 34.0585, lon: -118.4397 },
  { permit_nbr: 'BLD-2025-02314', primary_address: '6200 Canoga Ave', permit_type: 'Building', permit_sub_type: 'Industrial Warehouse', issue_date: '2025-09-25', valuation: 9500000, status_desc: 'Plan Check', zone: 'M1-1', council_district: 3, community_plan_area: 'Canoga Park', contractor: 'ProLogis Development', lat: 34.1885, lon: -118.5966 },
  { permit_nbr: 'BLD-2025-02415', primary_address: '4020 N Verdugo Rd', permit_type: 'Building', permit_sub_type: 'Residential Addition', issue_date: '2025-12-07', valuation: 380000, status_desc: 'Issued', zone: 'R1-1', council_district: 4, community_plan_area: 'Silver Lake-Echo Park', contractor: 'Homestead Builders', lat: 34.1285, lon: -118.2310 },
  { permit_nbr: 'ELE-2025-02890', primary_address: '3400 Riverside Dr', permit_type: 'Electrical', permit_sub_type: 'Commercial Wiring', issue_date: '2025-11-18', valuation: 53000, status_desc: 'Issued', zone: 'C1.5-1VL', council_district: 4, community_plan_area: 'Silver Lake-Echo Park', contractor: 'Silver Lake Electric', lat: 34.1173, lon: -118.2573 },
  { permit_nbr: 'BLD-2025-02516', primary_address: '1600 Vine St', permit_type: 'Building', permit_sub_type: 'Mixed Use High-Rise', issue_date: '2025-08-05', valuation: 95000000, status_desc: 'Under Construction', zone: 'C4-2D-SN', council_district: 13, community_plan_area: 'Hollywood', contractor: 'Lendlease', lat: 34.1002, lon: -118.3265 },
  { permit_nbr: 'PLM-2025-00920', primary_address: '901 S Flower St', permit_type: 'Plumbing', permit_sub_type: 'Backflow Prevention', issue_date: '2025-12-11', valuation: 12000, status_desc: 'Issued', zone: 'C2-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Flow Pro Plumbing', lat: 34.0440, lon: -118.2615 },
  { permit_nbr: 'BLD-2025-02617', primary_address: '21600 Oxnard St', permit_type: 'Building', permit_sub_type: 'Retail Center', issue_date: '2025-09-30', valuation: 11000000, status_desc: 'Plan Check', zone: 'C2-1VL', council_district: 6, community_plan_area: 'Woodland Hills', contractor: 'Majestic Realty Co', lat: 34.1762, lon: -118.5880 },
  { permit_nbr: 'BLD-2025-02718', primary_address: '550 S Main St', permit_type: 'Building', permit_sub_type: 'Hotel New Construction', issue_date: '2025-07-28', valuation: 62000000, status_desc: 'Under Construction', zone: 'C5-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Balfour Beatty', lat: 34.0465, lon: -118.2505 },
  { permit_nbr: 'MEC-2025-01278', primary_address: '8383 Wilshire Blvd', permit_type: 'Mechanical', permit_sub_type: 'Kitchen Hood System', issue_date: '2025-11-22', valuation: 68000, status_desc: 'Issued', zone: 'C4-2D', council_district: 5, community_plan_area: 'Wilshire', contractor: 'Restaurant Mechanical LLC', lat: 34.0634, lon: -118.3645 },
  { permit_nbr: 'BLD-2025-02819', primary_address: '15301 Ventura Blvd', permit_type: 'Building', permit_sub_type: 'Office Build-Out', issue_date: '2025-10-22', valuation: 1200000, status_desc: 'Issued', zone: 'C2-1VL', council_district: 4, community_plan_area: 'Sherman Oaks', contractor: 'ProBuild Commercial', lat: 34.1556, lon: -118.4552 },
  { permit_nbr: 'ELE-2025-03012', primary_address: '245 E 1st St', permit_type: 'Electrical', permit_sub_type: 'Transformer Upgrade', issue_date: '2025-11-28', valuation: 180000, status_desc: 'Issued', zone: 'C2-2D', council_district: 14, community_plan_area: 'Central City', contractor: 'LADWP Contractors', lat: 34.0497, lon: -118.2408 },
  { permit_nbr: 'BLD-2025-02920', primary_address: '3701 S Western Ave', permit_type: 'Building', permit_sub_type: 'Community Center', issue_date: '2025-08-10', valuation: 7800000, status_desc: 'Under Construction', zone: 'C2-1', council_district: 8, community_plan_area: 'South Los Angeles', contractor: 'C.W. Driver Companies', lat: 34.0172, lon: -118.3090 },
  { permit_nbr: 'BLD-2025-03021', primary_address: '1300 S Figueroa St', permit_type: 'Building', permit_sub_type: 'Residential Tower', issue_date: '2025-07-05', valuation: 210000000, status_desc: 'Under Construction', zone: 'C2-4D', council_district: 14, community_plan_area: 'Central City', contractor: 'Skanska USA', lat: 34.0380, lon: -118.2665 },
  { permit_nbr: 'GRD-2025-00234', primary_address: '1455 Rising Glen Rd', permit_type: 'Grading', permit_sub_type: 'Pool Excavation', issue_date: '2025-10-15', valuation: 240000, status_desc: 'Issued', zone: 'RE15-1-H', council_district: 4, community_plan_area: 'Hollywood', contractor: 'Prestige Grading', lat: 34.1132, lon: -118.3715 },
  { permit_nbr: 'BLD-2025-03122', primary_address: '3233 N Mission Rd', permit_type: 'Building', permit_sub_type: 'Warehouse Conversion', issue_date: '2025-09-12', valuation: 4200000, status_desc: 'Plan Check', zone: 'M1-1', council_district: 1, community_plan_area: 'Northeast Los Angeles', contractor: 'R&R Construction', lat: 34.0720, lon: -118.2125 },
  { permit_nbr: 'PLM-2025-01056', primary_address: '6520 Selma Ave', permit_type: 'Plumbing', permit_sub_type: 'Gas Line Install', issue_date: '2025-12-09', valuation: 18000, status_desc: 'Issued', zone: 'C4-2D-SN', council_district: 13, community_plan_area: 'Hollywood', contractor: 'LA Gas Pros', lat: 34.0979, lon: -118.3327 },
];

export const planningCases: PlanningCase[] = [
  { case_number: 'CPC-2025-1234-DB', address: '6250 Hollywood Blvd', case_type: 'CPC', filing_date: '2025-06-15', project_description: 'Density bonus for 250-unit mixed-use development with ground floor retail and 25% affordable units', council_district: 13, community_plan_area: 'Hollywood', status: 'Under Review', lat: 34.1012, lon: -118.3247 },
  { case_number: 'ENV-2025-0567-EIR', address: '900 S Figueroa St', case_type: 'ENV', filing_date: '2025-04-20', project_description: 'Environmental Impact Report for 45-story mixed-use tower with 520 residential units', council_district: 14, community_plan_area: 'Central City', status: 'Draft EIR', lat: 34.0440, lon: -118.2618 },
  { case_number: 'DIR-2025-0890-SPP', address: '3800 Wilshire Blvd', case_type: 'DIR', filing_date: '2025-07-10', project_description: "Director's approval for specific plan project in Wilshire Center for 180-unit residential building", council_district: 10, community_plan_area: 'Wilshire', status: 'Approved', lat: 34.0618, lon: -118.3092 },
  { case_number: 'VTT-2025-0345-HCA', address: '4500 Sunset Blvd', case_type: 'VTT', filing_date: '2025-05-22', project_description: 'Vesting tentative tract map for 12-lot subdivision with hillside conservation area overlay', council_district: 13, community_plan_area: 'Silver Lake-Echo Park', status: 'Hearing Scheduled', lat: 34.0985, lon: -118.2847 },
  { case_number: 'ZA-2025-0678-CUB', address: '11900 Wilshire Blvd', case_type: 'ZA', filing_date: '2025-08-01', project_description: 'Conditional use for beer and wine at new restaurant with outdoor patio in Brentwood', council_district: 11, community_plan_area: 'Brentwood', status: 'Under Review', lat: 34.0446, lon: -118.4610 },
  { case_number: 'CPC-2025-1567-ZC', address: '700 S Flower St', case_type: 'CPC', filing_date: '2025-03-15', project_description: 'Zone change from C2 to C2-4D to permit 38-story office and residential development', council_district: 14, community_plan_area: 'Central City', status: 'Approved', lat: 34.0492, lon: -118.2598 },
  { case_number: 'TT-2025-0234-CC', address: '2200 Colorado Blvd', case_type: 'TT', filing_date: '2025-09-05', project_description: 'Tentative tract map for 8-unit small lot subdivision near Eagle Rock', council_district: 14, community_plan_area: 'Northeast Los Angeles', status: 'Under Review', lat: 34.1368, lon: -118.2118 },
  { case_number: 'EAR-2025-0456-SP', address: '12300 W Washington Blvd', case_type: 'EAR', filing_date: '2025-06-28', project_description: 'Early assessment review for 150-unit senior housing complex in Culver City-adjacent area', council_district: 11, community_plan_area: 'Palms-Mar Vista-Del Rey', status: 'Draft Report', lat: 34.0014, lon: -118.3946 },
  { case_number: 'CPC-2025-1890-GPAJ', address: '1000 N Highland Ave', case_type: 'CPC', filing_date: '2025-07-22', project_description: 'General plan amendment and zone change for transit-oriented development near Metro station', council_district: 13, community_plan_area: 'Hollywood', status: 'Hearing Scheduled', lat: 34.0890, lon: -118.3382 },
  { case_number: 'DIR-2025-1023-TOC', address: '5050 Venice Blvd', case_type: 'DIR', filing_date: '2025-10-01', project_description: 'Transit-oriented communities approval for 85-unit affordable housing project', council_district: 10, community_plan_area: 'West Adams', status: 'Under Review', lat: 34.0296, lon: -118.3400 },
  { case_number: 'ENV-2025-0789-MND', address: '3400 S La Cienega Blvd', case_type: 'ENV', filing_date: '2025-05-10', project_description: 'Mitigated negative declaration for 200-unit apartment complex with parking structure', council_district: 10, community_plan_area: 'West Adams', status: 'Public Comment', lat: 34.0250, lon: -118.3735 },
  { case_number: 'ZA-2025-0901-ZV', address: '7800 Melrose Ave', case_type: 'ZA', filing_date: '2025-08-15', project_description: 'Zone variance for lot coverage and height to allow boutique hotel in commercial zone', council_district: 5, community_plan_area: 'Wilshire', status: 'Under Review', lat: 34.0835, lon: -118.3560 },
  { case_number: 'CPC-2025-2100-SP', address: '2500 S Vermont Ave', case_type: 'CPC', filing_date: '2025-04-05', project_description: 'Specific plan approval for university-adjacent mixed-use development near USC', council_district: 8, community_plan_area: 'South Los Angeles', status: 'Approved', lat: 34.0265, lon: -118.2916 },
  { case_number: 'VTT-2025-0567-CC', address: '4200 W Pico Blvd', case_type: 'VTT', filing_date: '2025-09-18', project_description: 'Vesting tentative tract map for 45-unit condo development with community open space', council_district: 10, community_plan_area: 'Wilshire', status: 'Under Review', lat: 34.0475, lon: -118.3260 },
  { case_number: 'DIR-2025-1345-SPPA', address: '10800 Lindbrook Dr', case_type: 'DIR', filing_date: '2025-10-15', project_description: 'Specific plan project permit for mixed-use in Westwood Village Specific Plan area', council_district: 5, community_plan_area: 'Westwood', status: 'Under Review', lat: 34.0594, lon: -118.4442 },
  { case_number: 'CPC-2025-2345-DB', address: '1801 N Argyle Ave', case_type: 'CPC', filing_date: '2025-11-01', project_description: 'Density bonus for 350-unit residential tower near Hollywood & Vine Metro station', council_district: 13, community_plan_area: 'Hollywood', status: 'Filing Complete', lat: 34.1037, lon: -118.3255 },
  { case_number: 'ZA-2025-1100-CU', address: '14500 Ventura Blvd', case_type: 'ZA', filing_date: '2025-06-10', project_description: 'Conditional use permit for drive-through restaurant in Sherman Oaks commercial corridor', council_district: 4, community_plan_area: 'Sherman Oaks', status: 'Approved', lat: 34.1543, lon: -118.4415 },
  { case_number: 'ENV-2025-1012-CE', address: '520 S Main St', case_type: 'ENV', filing_date: '2025-07-30', project_description: 'Categorical exemption for adaptive reuse of historic building to boutique hotel (60 rooms)', council_district: 14, community_plan_area: 'Central City', status: 'Approved', lat: 34.0470, lon: -118.2500 },
  { case_number: 'TT-2025-0456-SL', address: '3700 Glenfeliz Blvd', case_type: 'TT', filing_date: '2025-08-20', project_description: 'Tentative tract for small lot subdivision of 6 detached homes in Atwater Village', council_district: 13, community_plan_area: 'Silver Lake-Echo Park', status: 'Under Review', lat: 34.1150, lon: -118.2640 },
  { case_number: 'CPC-2025-2567-HD', address: '2300 E Cesar E Chavez Ave', case_type: 'CPC', filing_date: '2025-09-28', project_description: 'Height district change and zone change for 120-unit mixed-use in Boyle Heights', council_district: 14, community_plan_area: 'Boyle Heights', status: 'Under Review', lat: 34.0490, lon: -118.2170 },
  { case_number: 'DIR-2025-1567-RDP', address: '625 S Los Angeles St', case_type: 'DIR', filing_date: '2025-11-10', project_description: 'Redevelopment plan approval for Arts District creative office and residential campus', council_district: 14, community_plan_area: 'Central City North', status: 'Filing Complete', lat: 34.0440, lon: -118.2450 },
];

export const places: Place[] = [
  { slug: 'cd-1', name: 'Council District 1', type: 'council_district', permit_count: 342, planning_case_count: 18, top_permit_type: 'Building', lat: 34.0700, lon: -118.2100 },
  { slug: 'cd-3', name: 'Council District 3', type: 'council_district', permit_count: 287, planning_case_count: 12, top_permit_type: 'Building', lat: 34.1800, lon: -118.5400 },
  { slug: 'cd-4', name: 'Council District 4', type: 'council_district', permit_count: 498, planning_case_count: 24, top_permit_type: 'Building', lat: 34.1100, lon: -118.3500 },
  { slug: 'cd-5', name: 'Council District 5', type: 'council_district', permit_count: 512, planning_case_count: 28, top_permit_type: 'Building', lat: 34.0580, lon: -118.4400 },
  { slug: 'cd-6', name: 'Council District 6', type: 'council_district', permit_count: 198, planning_case_count: 8, top_permit_type: 'Building', lat: 34.1900, lon: -118.5800 },
  { slug: 'cd-8', name: 'Council District 8', type: 'council_district', permit_count: 156, planning_case_count: 10, top_permit_type: 'Building', lat: 34.0100, lon: -118.3000 },
  { slug: 'cd-9', name: 'Council District 9', type: 'council_district', permit_count: 234, planning_case_count: 15, top_permit_type: 'Building', lat: 34.0100, lon: -118.2800 },
  { slug: 'cd-10', name: 'Council District 10', type: 'council_district', permit_count: 389, planning_case_count: 22, top_permit_type: 'Building', lat: 34.0500, lon: -118.3200 },
  { slug: 'cd-11', name: 'Council District 11', type: 'council_district', permit_count: 445, planning_case_count: 19, top_permit_type: 'Building', lat: 34.0300, lon: -118.4500 },
  { slug: 'cd-13', name: 'Council District 13', type: 'council_district', permit_count: 678, planning_case_count: 35, top_permit_type: 'Building', lat: 34.0970, lon: -118.3300 },
  { slug: 'cd-14', name: 'Council District 14', type: 'council_district', permit_count: 723, planning_case_count: 42, top_permit_type: 'Building', lat: 34.0500, lon: -118.2500 },
  { slug: 'hollywood', name: 'Hollywood', type: 'community_plan_area', permit_count: 534, planning_case_count: 28, top_permit_type: 'Building', lat: 34.0980, lon: -118.3290 },
  { slug: 'central-city', name: 'Central City', type: 'community_plan_area', permit_count: 612, planning_case_count: 38, top_permit_type: 'Building', lat: 34.0470, lon: -118.2560 },
  { slug: 'wilshire', name: 'Wilshire', type: 'community_plan_area', permit_count: 398, planning_case_count: 20, top_permit_type: 'Building', lat: 34.0625, lon: -118.3400 },
  { slug: 'westwood', name: 'Westwood', type: 'community_plan_area', permit_count: 187, planning_case_count: 9, top_permit_type: 'Building', lat: 34.0590, lon: -118.4430 },
  { slug: 'south-los-angeles', name: 'South Los Angeles', type: 'community_plan_area', permit_count: 312, planning_case_count: 16, top_permit_type: 'Building', lat: 34.0100, lon: -118.2900 },
  { slug: 'west-los-angeles', name: 'West Los Angeles', type: 'community_plan_area', permit_count: 267, planning_case_count: 11, top_permit_type: 'Building', lat: 34.0400, lon: -118.4300 },
  { slug: 'sherman-oaks', name: 'Sherman Oaks', type: 'community_plan_area', permit_count: 178, planning_case_count: 7, top_permit_type: 'Building', lat: 34.1530, lon: -118.4500 },
  { slug: 'silver-lake-echo-park', name: 'Silver Lake-Echo Park', type: 'community_plan_area', permit_count: 234, planning_case_count: 13, top_permit_type: 'Building', lat: 34.1150, lon: -118.2600 },
];

export const permitTrendData = [
  { month: 'Jan', count: 1245 },
  { month: 'Feb', count: 1180 },
  { month: 'Mar', count: 1390 },
  { month: 'Apr', count: 1520 },
  { month: 'May', count: 1680 },
  { month: 'Jun', count: 1590 },
  { month: 'Jul', count: 1720 },
  { month: 'Aug', count: 1850 },
  { month: 'Sep', count: 1640 },
  { month: 'Oct', count: 1780 },
  { month: 'Nov', count: 1920 },
  { month: 'Dec', count: 1560 },
];

// Aliases for backward compatibility
export const mockPermits = permits;

export const PERMIT_TYPES = [
  'Building',
  'Electrical',
  'Plumbing',
  'Mechanical',
  'Grading',
] as const;

export const COUNCIL_DISTRICTS = Array.from({ length: 15 }, (_, i) => String(i + 1));

export const COMMUNITY_PLAN_AREAS = [
  'Hollywood',
  'Central City',
  'Wilshire',
  'Westwood',
  'South Los Angeles',
  'West Los Angeles',
  'Sherman Oaks',
  'Silver Lake-Echo Park',
  'Century City',
  'Bel Air-Beverly Crest',
  'Central City North',
  'Palms-Mar Vista-Del Rey',
  'Brentwood',
  'Canoga Park',
  'Northeast Los Angeles',
  'Boyle Heights',
  'Woodland Hills',
  'West Adams',
] as const;
