export const SITE = {
  name: 'Miinala & Kaisanlahti',
  fullName: 'Asianajotoimisto Miinala & Kaisanlahti',
  url: 'https://miinalakaisanlahti.fi',
  kyc: 'https://app.netvisorkyc.fi/firmToken/',
} as const

export const LAWYERS = [
  {
    slug: 'satu',
    name: 'Satu Miinala',
    title: 'Asianajaja, VT',
    phone: '040 487 665',
    email: 'satu@miinalakaisanlahti.fi',
    office: 'Rovaniemi',
    image: '/images/satu.webp',
  },
  {
    slug: 'niina',
    name: 'Niina Kaisanlahti',
    title: 'Asianajaja, VT',
    phone: '0400 914 316',
    email: 'niina@miinalakaisanlahti.fi',
    office: 'Kemijärvi & Rovaniemi',
    image: '/images/niina.webp',
  },
] as const

export const SERVICES = [
  { slug: 'rikosasiat', href: '/palvelut/rikosasiat', title: 'Rikosasiat' },
  { slug: 'perheoikeudelliset-asiat', href: '/palvelut/perheoikeudelliset-asiat', title: 'Perheoikeudelliset asiat' },
  { slug: 'perintooikeudelliset-asiat', href: '/palvelut/perintooikeudelliset-asiat', title: 'Perintöoikeudelliset asiat' },
  { slug: 'riita-asiat', href: '/palvelut/riita-asiat', title: 'Riita-asiat' },
] as const

export const OFFICES = [
  {
    city: 'Rovaniemi',
    address: 'Rovakatu 20–22 B 50',
    zip: '96200 Rovaniemi',
  },
  {
    city: 'Kemijärvi',
    address: 'Vapaudenkatu 8 A',
    zip: '98100 Kemijärvi',
  },
] as const
