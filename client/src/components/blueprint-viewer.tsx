import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HolographicSuit3D } from '@/components/holographic-suit-3d';
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Holographic Blueprint Viewer</h2>
          <p className="text-sm text-muted-foreground">Explore Iron Man suit specifications and history</p>
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

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Suit List */}
        <div className="w-80 overflow-y-auto border rounded-lg bg-card/50 backdrop-blur">
          <div className="sticky top-0 bg-background/80 backdrop-blur border-b p-3 z-10">
            <p className="text-sm font-semibold">{suits?.length || 0} Suits Available</p>
          </div>
          <div className="divide-y">
            {suits?.map((s: IronManSuit) => (
              <button
                key={s.markNumber}
                onClick={() => setSelectedMark(s.markNumber)}
                className={`w-full p-3 text-left hover-elevate transition-colors ${
                  selectedMark === s.markNumber ? 'bg-primary/20 border-l-2 border-primary' : 'hover:bg-accent/10'
                }`}
                data-testid={`button-select-suit-${s.markNumber}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.filmIntroduced}</p>
                  </div>
                  {selectedMark === s.markNumber && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail View */}
        <div className="flex-1 overflow-y-auto">
          {isSuitLoading ? (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <Cpu className="w-12 h-12 mx-auto mb-2 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading blueprint...</p>
              </div>
            </Card>
          ) : suit ? (
            <div className="space-y-4">
              {/* 3D Holographic Suit Viewer */}
              <HolographicSuit3D
                suitName={suit.name}
                color={suit.color}
                markNumber={suit.markNumber}
              />
              {/* Main Suit Card */}
              <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl">{suit.name}</CardTitle>
                      <CardDescription className="text-base">{suit.specialization}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(suit.status)} data-testid={`badge-suit-status-${suit.status}`}>
                      {suit.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Film Introduced</p>
                      <p className="text-sm font-medium">{suit.filmIntroduced}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Color Scheme</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: suit.color === 'Red and Gold' ? '#DC2626' : '#999' }}
                          data-testid={`div-suit-color-${suit.markNumber}`}
                        />
                        <span className="text-sm">{suit.color}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Armor Material</p>
                    <p className="text-sm">{suit.technicalSpecs.armor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Power Source</p>
                    <p className="text-sm">{suit.technicalSpecs.power}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {suit.technicalSpecs.capabilities.map((cap: string) => (
                        <Badge key={cap} variant="secondary" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Combat Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Combat Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Key Usages</p>
                    <ul className="space-y-1">
                      {suit.keyUsages.map((usage: string, i: number) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{usage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {suit.weaknesses && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Weaknesses</p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">{suit.weaknesses}</p>
                    </div>
                  )}
                  {suit.upgrades && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Key Upgrades</p>
                      <p className="text-sm text-green-600 dark:text-green-400">{suit.upgrades}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notable Moments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notable Moments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suit.notableMoments.map((moment: string, i: number) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        <span>{moment}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Select a suit to view its blueprint</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
