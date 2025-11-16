import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface AccountSettingsModalProps {
  donationId: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

const DeleteDonationModal = ({ donationId,isOpen, onClose, onDelete }: AccountSettingsModalProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/donations/${donationId}`);
      toast.success('Donation deleted successfully');
      onClose();
      onDelete()
    } catch (error) {
      toast.error('Failed to delete donation');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
        </DialogHeader>

        {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="w-full"
            >
              Delete Donation
            </Button>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-sm">Delete Donation?</p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. This will permanently delete your donation.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={showDeleteConfirm ? () => setShowDeleteConfirm(false) : onClose}
          >
            {showDeleteConfirm ? 'Cancel' : 'Close'}
          </Button>
          {showDeleteConfirm && (
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Donation'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDonationModal;