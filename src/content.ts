export const sections = [
  { id: 'intro', label: 'Intro' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'favourites', label: 'Favourites' },
  { id: 'travel', label: 'Travel' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export const sectionIds: readonly SectionId[] = sections.map(section => section.id);

/** A sprite symbol id from index.html plus the visible label next to it. */
export interface Labelled {
  icon: string;
  name: string;
}

export interface Place {
  flag: string;
  name: string;
}

/** A label/value line in a HUD data block. */
export interface Fact {
  label: string;
  value: string;
}

export const intro = {
  facts: [
    { label: 'Based in', value: 'Eindhoven, Netherlands' },
    { label: 'Born in', value: 'Hanoi, Vietnam' },
    { label: 'Birthday', value: '26/09/2001' },
  ] satisfies Fact[],
  languages: [
    { flag: 'vn', name: 'Vietnamese' },
    { flag: 'nl', name: 'Dutch' },
    { flag: 'gb', name: 'English' },
  ] satisfies Place[],
  lead: "I'm a Data & AI Engineer based in Eindhoven, where I build AI agents either for daily tasks or R&D operations. Away from the desk I'm in the gym or the pool, cooking something ambitious, flying fighters in DCS, or working through a list of countries that keeps getting longer.",
};

export const jobs = [
  {
    logo: 'philips-shield.svg',
    wide: false,
    company: 'Philips',
    place: 'Eindhoven, Netherlands',
    start: 'Nov 2025',
    end: 'present',
    role: 'Data & AI Engineer',
    summary: 'I build AI agents for R&D operations, ranging from software development, testing, documentation and any replacable manual work. Ocassionally working on AI features for Personal Health products.',
  },
  {
    logo: 'asml.svg',
    wide: true,
    company: 'ASML',
    place: 'Veldhoven, Netherlands',
    start: 'Dec 2024',
    end: 'Oct 2025',
    role: 'AI/Software Engineer',
    summary: "Minimizing the overlay between semiconductor layers, enabling ASML's latest High-NA EUV machine to print more chips with higher quality.",
  },
];

export interface Degree {
  logo: string;
  wide: boolean;
  title: string;
  school?: string;
  start: string;
  end: string;
}

export const degrees: Degree[] = [
  { logo: 'tue.png', wide: true, title: 'MSc Data Science and Artificial Intelligence', school: 'Eindhoven University of Technology', start: '2024', end: '2026' },
  { logo: 'tilburg.png', wide: false, title: 'BSc Cognitive Science and Artificial Intelligence', school: 'Tilburg University', start: '2020', end: '2024' },
  { logo: 'hsgs.png', wide: false, title: 'HSGS High School for Gifted Students', start: '2016', end: '2019' },
  { logo: 'marie-curie.png', wide: false, title: 'Marie Curie Middle School', start: '2012', end: '2016' },
];

export const stack: { title: string; items: Labelled[] }[] = [
  {
    title: 'Languages',
    items: [
      { icon: 'si-python', name: 'Python' },
      { icon: 'si-c', name: 'C' },
      { icon: 'si-cplusplus', name: 'C++' },
      { icon: 'lu-database', name: 'SQL' },
      { icon: 'si-javascript', name: 'JavaScript' },
      { icon: 'si-html5', name: 'HTML' },
      { icon: 'si-css', name: 'CSS' },
    ],
  },
  {
    title: 'Machine learning',
    items: [
      { icon: 'si-pytorch', name: 'PyTorch' },
      { icon: 'si-ultralytics', name: 'YOLO' },
      { icon: 'si-huggingface', name: 'Hugging Face' },
      { icon: 'si-langchain', name: 'LangChain' },
      { icon: 'si-langgraph', name: 'LangGraph' },
      { icon: 'si-ollama', name: 'Ollama' },
    ],
  },
  {
    title: 'Web and services',
    items: [
      { icon: 'si-fastapi', name: 'FastAPI' },
      { icon: 'si-flask', name: 'Flask' },
      { icon: 'si-react', name: 'React' },
      { icon: 'si-streamlit', name: 'Streamlit' },
    ],
  },
  {
    title: 'Data',
    items: [
      { icon: 'si-numpy', name: 'NumPy' },
      { icon: 'si-pandas', name: 'Pandas' },
      { icon: 'lu-chart-spline', name: 'Matplotlib' },
      { icon: 'lu-boxes', name: 'ChromaDB' },
    ],
  },
  {
    title: 'Testing and delivery',
    items: [
      { icon: 'si-pytest', name: 'Pytest' },
      { icon: 'si-sonarqubeserver', name: 'SonarQube' },
      { icon: 'si-git', name: 'Git' },
      { icon: 'dv-azuredevops', name: 'Azure DevOps' },
      { icon: 'lu-infinity', name: 'CI/CD' },
      { icon: 'lu-cloud', name: 'AWS' },
      { icon: 'si-linux', name: 'Linux' },
    ],
  },
];

/** A favourites row shows either icon picks or a plain sentence. */
export type Facet = { icon: string; title: string } & ({ picks: Labelled[] } | { text: string });

export const facets: Facet[] = [
  {
    icon: 'lu-dumbbell',
    title: 'Hobbies',
    picks: [
      { icon: 'lu-dumbbell', name: 'Gym' },
      { icon: 'lu-waves-ladder', name: 'Swimming' },
      { icon: 'lu-gamepad-2', name: 'Gaming' },
      { icon: 'lu-chef-hat', name: 'Cooking' },
      { icon: 'lu-plane', name: 'Flight Sim' },
      { icon: 'lu-compass', name: 'Exploring' },
    ],
  },
  {
    icon: 'lu-film',
    title: 'Films',
    picks: [
      { icon: 'lu-plane-takeoff', name: 'Top Gun' },
      { icon: 'lu-rocket', name: 'Star Trek' },
      { icon: 'lu-swords', name: 'Star Wars' },
    ],
  },
  {
    icon: 'lu-tv',
    title: 'Series',
    picks: [
      { icon: 'lu-crown', name: 'Game of Thrones' },
      { icon: 'lu-venetian-mask', name: 'Daredevil' },
      { icon: 'lu-atom', name: 'The Big Bang Theory' },
    ],
  },
  { icon: 'lu-book-open', title: 'Reading', text: 'Thinking, Fast and Slow · Atomic Habits' },
  {
    icon: 'lu-gamepad-2',
    title: 'Playing',
    picks: [
      { icon: 'lu-sword', name: 'League of Legends' },
      { icon: 'lu-crosshair', name: 'CS2' },
      { icon: 'lu-radar', name: 'Digital Combat Simulator' },
    ],
  },
  {
    icon: 'lu-compass',
    title: 'Following',
    picks: [
      { icon: 'lu-brain-circuit', name: 'AI' },
      { icon: 'lu-car-front', name: 'Formula 1' },
      { icon: 'lu-trophy', name: 'Esports' },
    ],
  },
  { icon: 'lu-heart', title: 'Public Figures', text: 'Marco Pierre White, Max Verstappen' },
];

interface Region {
  title: string;
  icon: string;
  places: Place[];
}

/** Visited countries by region, plus the destinations still ahead. */
export const travel: { visited: Region[]; next: Region } = {
  visited: [
    {
      title: 'Asia',
      icon: 'lu-map-pin',
      places: [
        { flag: 'vn', name: 'Vietnam' },
        { flag: 'th', name: 'Thailand' },
        { flag: 'sg', name: 'Singapore' },
        { flag: 'cn', name: 'China' },
      ],
    },
    {
      title: 'Europe',
      icon: 'lu-map-pin',
      places: [
        { flag: 'nl', name: 'Netherlands' },
        { flag: 'de', name: 'Germany' },
        { flag: 'be', name: 'Belgium' },
        { flag: 'lu', name: 'Luxembourg' },
        { flag: 'hu', name: 'Hungary' },
        { flag: 'it', name: 'Italy' },
        { flag: 'es', name: 'Spain' },
        { flag: 'gr', name: 'Greece' },
        { flag: 'at', name: 'Austria' },
        { flag: 'cz', name: 'Czech Republic' },
        { flag: 'no', name: 'Norway' },
        { flag: 'ch', name: 'Switzerland' },
        { flag: 'fr', name: 'France' },
      ],
    },
  ],
  next: {
    title: 'Next',
    icon: 'lu-plane-takeoff',
    places: [
      { flag: 'jp', name: 'Japan' },
      { flag: 'kr', name: 'South Korea' },
      { flag: 'se', name: 'Sweden' },
      { flag: 'fi', name: 'Finland' },
      { flag: 'pt', name: 'Portugal' },
      { flag: 'us', name: 'USA' },
    ],
  },
};

export const contact = {
  place: 'Eindhoven, Netherlands',
  note: 'Reach me via Email, Facebook or even Instagram. I do not respond on LinkedIn (It is my personal hell).',
  socials: [
    { href: 'mailto:anh.nguyen.work78@gmail.com', label: 'Email', icon: 'lu-mail' },
    { href: 'https://linkedin.com/in/anhnguyen2609', label: 'LinkedIn', icon: 'dv-linkedin' },
    { href: 'https://github.com/DanDan201', label: 'GitHub', icon: 'si-github' },
    { href: 'https://www.facebook.com/adn26090001/', label: 'Facebook', icon: 'si-facebook' },
    { href: 'https://www.instagram.com/anh_ng269/', label: 'Instagram', icon: 'si-instagram' },
  ],
  quote: '“Focus on your actions, not the outcome. It is all you can control.”',
  updated: 'Last updated September 2026.',
};
