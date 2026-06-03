import { SiInstagram, SiDiscord, SiYoutube } from 'react-icons/si';
import { MessageCircle } from 'lucide-react';
import { useGetSocialMediaLinks } from '../hooks/useQueries';

export default function SocialMediaLinks() {
  const { data: socialLinks, isLoading } = useGetSocialMediaLinks();

  if (isLoading || !socialLinks) {
    return null;
  }

  const links = [
    {
      name: 'Instagram',
      url: socialLinks.instagram,
      icon: SiInstagram,
      color: 'hover:text-pink-500',
      glow: 'hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]',
    },
    {
      name: 'Discord',
      url: socialLinks.discord,
      icon: SiDiscord,
      color: 'hover:text-indigo-500',
      glow: 'hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]',
    },
    {
      name: 'YouTube',
      url: socialLinks.youtube,
      icon: SiYoutube,
      color: 'hover:text-red-500',
      glow: 'hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]',
    },
    {
      name: 'WhatsApp',
      url: socialLinks.whatsapp,
      icon: MessageCircle,
      color: 'hover:text-green-500',
      glow: 'hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]',
    },
  ];

  const activeLinks = links.filter(link => link.url);

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-6">
      {activeLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-muted-foreground transition-all duration-300 ${link.color} ${link.glow}`}
            aria-label={link.name}
          >
            <Icon className="w-6 h-6" />
          </a>
        );
      })}
    </div>
  );
}
