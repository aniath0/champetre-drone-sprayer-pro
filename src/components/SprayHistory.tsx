
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SprayRecord {
  id: string;
  date: string;
  fieldName: string;
  duration: string;
  coverage: number;
  product: string;
}

interface SprayHistoryProps {
  records: SprayRecord[];
}

const SprayHistory = ({ records }: SprayHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique de Pulvérisation</CardTitle>
        <CardDescription>Dernières sessions de pulvérisation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucun historique de pulvérisation disponible
            </div>
          ) : (
            records.map((record, index) => (
              <React.Fragment key={record.id}>
                {index > 0 && <Separator className="my-2" />}
                <div>
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium text-sm">{record.fieldName}</h4>
                    <span className="text-xs text-muted-foreground">{record.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Durée:</span>
                      <p>{record.duration}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Couverture:</span>
                      <p>{record.coverage}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Produit:</span>
                      <p>{record.product}</p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SprayHistory;
