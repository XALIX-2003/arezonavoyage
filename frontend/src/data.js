import agadir1 from './assets/images/agadir/agadir-1.png';
import agadir2 from './assets/images/agadir/agadir-2.png';
import agadir3 from './assets/images/agadir/agadir-3.png';
import agadir4 from './assets/images/agadir/agadir-4.png';
import agadir5 from './assets/images/agadir/agadir-5.png';
import marrakech1 from './assets/images/marrakech/marrakech-1.png';
import marrakech2 from './assets/images/marrakech/marrakech-2.png';
import marrakech3 from './assets/images/marrakech/marrakech-3.png';
import marrakech4 from './assets/images/marrakech/marrakech-4.png';
import marrakech5 from './assets/images/marrakech/marrakech-5.png';
import marrakech6 from './assets/images/marrakech/marrakech-6.png';
import dakhla1 from './assets/images/dakhla/dakhla-1.png';
import dakhla2 from './assets/images/dakhla/dakhla-2.png';
import dakhla3 from './assets/images/dakhla/dakhla-3.png';
import dakhla4 from './assets/images/dakhla/dakhla-4.png';
import dakhla5 from './assets/images/dakhla/dakhla-5.png';

const generateRandomAvailability = () => {
  const availability = {};
  const today = new Date();
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
    const availableDays = new Set();

    const numberOfAvailableSlots = Math.floor(Math.random() * 10) + 5; // 5 to 14 available slots

    for (let j = 0; j < numberOfAvailableSlots; j++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      availableDays.add(day);
    }
    availability[`${month} ${year}`] = Array.from(availableDays).sort((a, b) => a - b);
  }

  return availability;
};

const programs = [
  {
    id: 1,
    title: 'Marrakech, Imlil & Agafay',
    destination: 'Maroc',
    duration: '3 Jours / 2 Nuits',
    price: '85',
    image: marrakech1,
    images: [marrakech1, marrakech2, marrakech3, marrakech4, marrakech5, marrakech6],
    activities: ['boating', 'city tour'],
    details: [
      { day: 1, title: 'Arrivée à Marrakech & Médina', description: 'Installation à votre riad, puis visite guidée de la médina, de la place Jemaa el-Fna et des souks animés. Dîner libre.' },
      { day: 2, title: 'Excursion à Imlil & Atlas', description: 'Départ le matin pour les montagnes de l\'Atlas. Randonnée pédestre douce à travers les villages berbères et les paysages spectaculaires. Déjeuner chez l\'habitant. Retour à Marrakech en fin de journée.' },
      { day: 3, title: 'Aventure dans le désert d\'Agafay', description: 'Matinée libre à Marrakech. L\'après-midi, départ pour le désert d\'Agafay pour une balade à dos de dromadaire au coucher du soleil, suivie d\'un dîner traditionnel sous les étoiles avant le retour.' }
    ],
    availableDates: ['2025-10-20', '2025-10-27', '2025-11-03'],
    category: 'national'
  },
  {
    id: 2,
    title: 'Grand Tour de Dakhla',
    destination: 'Maroc',
    duration: '8 Jours / 6 Nuits',
    price: '350',
    image: dakhla1,
    images: [dakhla1, dakhla2, dakhla3, dakhla4, dakhla5],
    activities: ['kitesurf', 'dune blanche', 'source thermale'],
    details: [
      { day: 1, title: 'Arrivée à Dakhla & Installation', description: 'Installation à votre hôtel. Journée libre pour vous détendre ou explorer les environs.' },
      { day: 2, title: 'Sports Nautiques sur le Lagon', description: 'Journée dédiée aux sports nautiques : initiation ou perfectionnement au kitesurf et windsurf sur le célèbre lagon.' },
      { day: 3, title: 'Excursion à la Dune Blanche', description: 'Départ pour la majestueuse Dune Blanche. Baignade dans la lagune et déjeuner pique-nique sur place.' },
      { day: 4, title: 'Détente à la Source d\'Asnaa', description: 'Visite de la source thermale d\'Asnaa. Détente dans les eaux chaudes sulfureuses, réputées pour leurs bienfaits.' },
      { day: 5, title: 'Exploration de l\'Île du Dragon', description: 'Excursion à l\'Île du Dragon. Exploration de l\'île à marée basse et observation des flamants roses.' },
      { day: 6, title: 'Journée Libre & Activités Optionnelles', description: 'Profitez de la plage, ou optez pour une activité optionnelle comme la pêche sportive ou une balade en quad.' },
      { day: 7, title: 'Découverte de Dakhla Ville', description: 'Visite de la ville de Dakhla, son marché aux poissons animé et son phare historique. Dîner de fruits de mer frais.' },
      { day: 8, title: 'Départ', description: 'Petit-déjeuner à l\'hôtel et transfert à l\'aéroport pour votre vol de retour.' }
    ],
    availableDates: ['2025-11-10', '2025-11-17', '2025-11-24'],
    category: 'national'
  },
  {
    id: 3,
    title: 'Escapade à Agadir',
    destination: 'Maroc',
    duration: '4 Jours / 2 Nuits',
    price: '125',
    image: agadir1,
    images: [agadir1, agadir2, agadir3, agadir4, agadir5],
    activities: ['plage', 'souk', 'surf'],
    details: [
      { day: 1, title: 'Arrivée à Agadir & Plage', description: 'Installation à l\'hôtel et après-midi libre pour profiter de la plage et de la promenade en bord de mer.' },
      { day: 2, title: 'Agadir Oufella & Souk El Had', description: 'Visite d\'Agadir Oufella (la kasbah) pour une vue panoramique sur la ville et la baie. Exploration du Souk El Had, l\'un des plus grands souks du Maroc.' },
      { day: 3, title: 'Excursion à Taghazout', description: 'Visite du célèbre village de surfeurs, déjeuner dans un restaurant local face à l\'océan. Temps libre pour se détendre sur la plage.' },
      { day: 4, title: 'Derniers Moments & Départ', description: 'Matinée libre pour les derniers achats ou une baignade, puis transfert à l\'aéroport pour votre vol de retour.' }
    ],
    availableDates: ['2025-10-25', '2025-11-01', '2025-11-08'],
    category: 'national'
  }
];

export const programsData = programs.map(p => ({ ...p, availability: generateRandomAvailability() }));