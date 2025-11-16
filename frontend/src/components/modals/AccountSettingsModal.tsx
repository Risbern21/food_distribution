import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountSettingsModal = ({ isOpen, onClose }: AccountSettingsModalProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user,logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    onClose();
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/users/${user.user_id}`);
      toast.success('Account deleted successfully');
      logout();
      onClose();
    } catch (error) {
      toast.error('Failed to delete account');
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
          <div className="space-y-4 py-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="w-full"
            >
              Delete Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-sm">Delete Account?</p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. All your data will be permanently deleted.
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
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModal;