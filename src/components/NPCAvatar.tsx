import React from "react";

interface NPCAvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const NPCAvatar: React.FC<NPCAvatarProps> = ({ name, imageUrl, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-base"
  };

  // Generate a simple visual representation based on name
  const generateAvatar = (name: string) => {
    const cleanName = name.toLowerCase();
    
    // Special cases for notable NPCs
    if (cleanName.includes("gary") || cleanName.includes("paperclip")) {
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          {/* Robot head */}
          <rect x="8" y="6" width="16" height="12" rx="2" fill="hsl(var(--muted-foreground))" />
          {/* Eyes */}
          <circle cx="12" cy="11" r="1.5" fill="hsl(var(--background))" />
          <circle cx="20" cy="11" r="1.5" fill="hsl(var(--background))" />
          {/* Antenna */}
          <line x1="16" y1="6" x2="16" y2="3" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <circle cx="16" cy="3" r="1" fill="hsl(var(--accent))" />
        </svg>
      );
    }
    
    if (cleanName.includes("cat")) {
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          {/* Cat head */}
          <circle cx="16" cy="18" r="8" fill="hsl(var(--muted-foreground))" />
          {/* Ears */}
          <path d="M10 12 L12 8 L14 12" fill="hsl(var(--muted-foreground))" />
          <path d="M18 12 L20 8 L22 12" fill="hsl(var(--muted-foreground))" />
          {/* Eyes */}
          <circle cx="13" cy="16" r="1" fill="hsl(var(--background))" />
          <circle cx="19" cy="16" r="1" fill="hsl(var(--background))" />
          {/* Nose */}
          <path d="M16 18 L15 20 L17 20 Z" fill="hsl(var(--accent))" />
        </svg>
      );
    }
    
    if (cleanName.includes("disco") || cleanName.includes("socrates")) {
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          {/* Head with beard */}
          <circle cx="16" cy="16" r="10" fill="hsl(var(--muted-foreground))" />
          {/* Beard */}
          <path d="M8 20 Q16 28 24 20 Q20 24 16 24 Q12 24 8 20" fill="hsl(var(--muted-foreground))" />
          {/* Eyes */}
          <circle cx="12" cy="14" r="1" fill="hsl(var(--background))" />
          <circle cx="20" cy="14" r="1" fill="hsl(var(--background))" />
          {/* Disco element */}
          <circle cx="25" cy="7" r="2" fill="hsl(var(--accent))" opacity="0.7" />
        </svg>
      );
    }
    
    if (cleanName.includes("concept") || cleanName.includes("tuesday")) {
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          {/* Abstract concept */}
          <circle cx="16" cy="16" r="6" fill="hsl(var(--muted-foreground))" opacity="0.3" />
          <circle cx="16" cy="16" r="4" fill="hsl(var(--accent))" opacity="0.5" />
          <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))" opacity="0.7" />
        </svg>
      );
    }
    
    // Default: First letter in a circle
    return (
      <div className="w-full h-full bg-muted text-muted-foreground font-semibold flex items-center justify-center rounded-full">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        generateAvatar(name)
      )}
    </div>
  );
};

export default NPCAvatar;