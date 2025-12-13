export const PORTS = [
  { code: 'LKCMB', name: 'Colombo Port', lat: 6.9271, lng: 79.8612 },
  { code: 'LKHBM', name: 'Hambantota Port', lat: 6.1247, lng: 81.1185 },
  { code: 'LKTCL', name: 'Trincomalee Port', lat: 8.5874, lng: 81.2152 },
  { code: 'LKGAL', name: 'Galle Port', lat: 6.0329, lng: 80.2168 },
]

export const CITIES = [
  'Colombo', 'Gampaha', 'Kandy', 'Jaffna', 'Galle', 'Matara', 
  'Kurunegala', 'Anuradhapura', 'Trincomalee', 'Batticaloa'
]

export const SERVICES = [
  {
    id: 'sea-freight-fcl',
    name: 'Sea Freight (FCL)',
    description: 'Full Container Load shipping for larger cargo volumes',
    icon: 'Ship',
  },
  {
    id: 'sea-freight-lcl',
    name: 'Sea Freight (LCL)',
    description: 'Less than Container Load for smaller shipments',
    icon: 'Package',
  },
  {
    id: 'air-freight',
    name: 'Air Freight',
    description: 'Fast delivery for time-sensitive cargo',
    icon: 'Plane',
  },
  {
    id: 'land-transport',
    name: 'Land Transportation',
    description: 'Door-to-door delivery within Sri Lanka',
    icon: 'Truck',
  },
  {
    id: 'warehousing',
    name: 'Warehousing',
    description: 'Secure storage and distribution services',
    icon: 'Warehouse',
  },
  {
    id: 'customs',
    name: 'Customs Clearance',
    description: 'Efficient customs documentation and clearance',
    icon: 'FileText',
  },
]

export const SHIPMENT_STATUSES = [
  { value: 'booked', label: 'Booked', color: 'blue' },
  { value: 'picked-up', label: 'Picked Up', color: 'cyan' },
  { value: 'in-transit', label: 'In Transit', color: 'yellow' },
  { value: 'at-port', label: 'At Port', color: 'purple' },
  { value: 'customs', label: 'Customs Clearance', color: 'orange' },
  { value: 'out-for-delivery', label: 'Out for Delivery', color: 'green' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
]

export const CARGO_TYPES = [
  { value: 'general', label: 'General Cargo' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'machinery', label: 'Machinery' },
  { value: 'textiles', label: 'Textiles & Garments' },
  { value: 'food', label: 'Food & Beverages' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'fragile', label: 'Fragile Items' },
  { value: 'hazardous', label: 'Hazardous Materials' },
  { value: 'refrigerated', label: 'Refrigerated Goods' },
]

export const CONTAINER_SIZES = [
  { value: '20ft', label: "20' Standard", dimensions: "20' x 8' x 8.6'" },
  { value: '40ft', label: "40' Standard", dimensions: "40' x 8' x 8.6'" },
  { value: '40hc', label: "40' High Cube", dimensions: "40' x 8' x 9.6'" },
  { value: '45hc', label: "45' High Cube", dimensions: "45' x 8' x 9.6'" },
]

export const COMPANY_INFO = {
  name: 'New Emarald Frinters',
  tagline: 'Your Trusted Shipping Partner in Sri Lanka',
  email: 'info@lankashipping.lk',
  phone: '+94 11 234 5678',
  mobile: '+94 77 123 4567',
  whatsapp: '+94771234567',
  address: {
    street: '123 Galle Road',
    city: 'Colombo 03',
    country: 'Sri Lanka',
  },
  hours: 'Monday - Friday: 8:30 AM - 5:00 PM',
  social: {
    facebook: 'https://facebook.com/lankashipping',
    linkedin: 'https://linkedin.com/company/lankashipping',
    twitter: 'https://twitter.com/lankashipping',
  },
}
