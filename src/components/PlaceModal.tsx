import * as Dialog from '@radix-ui/react-dialog';
import { X, MapPin, UtensilsCrossed, Type, StickyNote } from 'lucide-react';
import type { FoodPlace } from '../types';
import { Map } from './Map';

interface PlaceModalProps {
  place: FoodPlace | null;
  onClose: () => void;
}

export function PlaceModal({ place, onClose }: PlaceModalProps) {
  if (!place) return null;

  return (
    <Dialog.Root open={!!place} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4">{place.name}</Dialog.Title>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <UtensilsCrossed className="h-5 w-5" />
                <div>
                  <div className="font-semibold">Food Items</div>
                  <div>{place.foodItems.join(', ')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Type className="h-5 w-5" />
                <div>
                  <div className="font-semibold">Type</div>
                  <div>{place.type}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5" />
                <div>
                  <div className="font-semibold">Address</div>
                  <div>{place.address}</div>
                </div>
              </div>

              {place.notes && (
                <div className="flex items-start gap-2 text-gray-700">
                  <StickyNote className="h-5 w-5 mt-1" />
                  <div>
                    <div className="font-semibold">Notes</div>
                    <div className="whitespace-pre-wrap">{place.notes}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-[300px] rounded-lg overflow-hidden">
              <Map
                center={[place.coordinates.lat, place.coordinates.lng]}
                marker={[place.coordinates.lat, place.coordinates.lng]}
                markerColor={place.markerColor}
              />
            </div>
          </div>

          <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}