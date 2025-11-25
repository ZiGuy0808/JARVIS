import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SuitImageViewer } from '@/components/suit-image-viewer';
import { ChevronRight, Zap, Shield, Cpu } from 'lucide-react';

interface IronManSuit {
  name: string;
  markNumber: number;
  filmIntroduced: string;
  yearsActive: string[];
  color: string;
  specialization: string;
  technicalSpecs: {
    armor: string;
    power: string;
    capabilities: string[];
  };
  keyUsages: string[];
  weaknesses?: string;
  upgrades?: string;
  status: 'Active' | 'Retired' | 'Destroyed' | 'Upgraded';
  notableMoments: string[];
}

export function BlueprintViewer() {
  const [selectedMark, setSelectedMark] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allSuits } = useQuery({
    queryKey: ['/api/blueprints/all'],
  }) as any;

  const { data: selectedSuit, isLoading: isSuitLoading } = useQuery({
    queryKey: ['/api/blueprints/mark', selectedMark],
    enabled: selectedMark !== null,
  }) as any;

  const { data: searchResults } = useQuery({
    queryKey: ['/api/blueprints/search', searchQuery],
    enabled: searchQuery.length > 0,
  }) as any;

  const suits: IronManSuit[] = searchQuery ? searchResults?.results : allSuits?.suits || [];
  const suit: IronManSuit | undefined = selectedSuit?.suit;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'Retired':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'Destroyed':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'Upgraded':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Iron Man Blueprint Gallery</h2>
          <p className="text-sm text-muted-foreground">All {suits.length} Suits with Holographic Images</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          placeholder="Search suits by name, film, or capability..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          data-testid="input-blueprint-search"
        />
      </div>

      {/* Two Panel Layout */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        {/* Left: 3D Grid of All Suits */}
        <div className="flex-1 overflow-y-auto border rounded-lg bg-card/30 backdrop-blur p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suits.map((s: IronManSuit) => (
              <div
                key={s.markNumber}
                onClick={() => setSelectedMark(s.markNumber)}
                className={`cursor-pointer rounded-lg border-2 transition-all hover-elevate ${
                  selectedMark === s.markNumber
                    ? 'border-cyan-500/80 bg-cyan-500/10'
                    : 'border-primary/30 hover:border-primary/60'
                }`}
                data-testid={`suit-card-3d-${s.markNumber}`}
              >
                {/* Suit Image Container */}
                <div className="p-2">
                  <SuitImageViewer
                    suitName={s.name}
                    color={s.color}
                    markNumber={s.markNumber}
                  />
                </div>

                {/* Suit Info Below 3D Model */}
                <div className="px-3 pb-3 text-center border-t border-primary/20 pt-2">
                  <h3 className="font-rajdhani font-bold text-xs truncate">{s.name}</h3>
                  <p className="text-xs text-muted-foreground">{s.filmIntroduced}</p>
                  <div className="mt-2 flex justify-center">
                    <Badge
                      className={`text-xs ${getStatusColor(s.status)}`}
                      data-testid={`badge-suit-status-${s.status}`}
                    >
                      {s.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {suits.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No suits found</p>
            </div>
          )}
        </div>

        {/* Right: Detailed View */}
        <div className="w-96 overflow-y-auto border rounded-lg bg-card/30 backdrop-blur">
          {isSuitLoading ? (
            <Card className="m-4 flex items-center justify-center min-h-96">
              <div className="text-center">
                <Cpu className="w-12 h-12 mx-auto mb-2 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading blueprint...</p>
              </div>
            </Card>
          ) : suit ? (
            <div className="p-4 space-y-4">
              {/* Main Suit Card */}
              <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl truncate">{suit.name}</CardTitle>
                      <CardDescription className="text-xs">{suit.specialization}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(suit.status)} data-testid={`badge-suit-status-detail-${suit.status}`}>
                      {suit.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-semibold text-muted-foreground">Film</p>
                      <p className="font-medium">{suit.filmIntroduced}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground">Color</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: suit.color === 'Red and Gold' ? '#DC2626' : '#999' }}
                        />
                        <span className="text-xs">{suit.color}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Specs */}
              <Card className="bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Specs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div>
                    <p className="font-semibold text-muted-foreground">Armor</p>
                    <p>{suit.technicalSpecs.armor}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">Power</p>
                    <p>{suit.technicalSpecs.power}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">Capabilities</p>
                    <div className="flex flex-wrap gap-1">
                      {suit.technicalSpecs.capabilities.map((cap: string) => (
                        <Badge key={cap} variant="secondary" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Combat Info */}
              <Card className="bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Combat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">Key Usages</p>
                    <ul className="space-y-1">
                      {suit.keyUsages.map((usage: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{usage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {suit.weaknesses && (
                    <div>
                      <p className="font-semibold text-orange-600 dark:text-orange-400">Weaknesses</p>
                      <p className="text-orange-600 dark:text-orange-400">{suit.weaknesses}</p>
                    </div>
                  )}
                  {suit.upgrades && (
                    <div>
                      <p className="font-semibold text-green-600 dark:text-green-400">Upgrades</p>
                      <p className="text-green-600 dark:text-green-400">{suit.upgrades}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notable Moments */}
              <Card className="bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Notable Moments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs">
                    {suit.notableMoments.map((moment: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        <span>{moment}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">Select a suit to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
