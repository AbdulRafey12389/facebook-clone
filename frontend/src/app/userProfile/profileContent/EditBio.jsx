import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateUserBio } from "@/services/user.service";
import { Save } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function EditBio({ isOpen, onClose, fetchProfile, initialData, id }) {
  const { register, handleSubmit, reset, formState: {isSubmitting} } = useForm({
    defaultValues: initialData
  });

  const handleEditBio = async (data) => {
    try {
      await createOrUpdateUserBio(id, data);
      await fetchProfile();
      onClose();
      toast.success("Your bio updated successfully!")
    } catch (error) {
      toast.success("Your bio cloudn't be update!!");
      console.log(error);
      
      
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader></DialogHeader>
        <DialogTitle>
          Edit bio
        </DialogTitle>

        <form onSubmit={handleSubmit(handleEditBio)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea id="bioText"  { ...register("bioText") } className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="liveIn" className="text-right">
                Live In
              </Label>
              <Input id="liveIn" className="col-span-3" { ...register("liveIn") } />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relationship" className="text-right">
                Relationship
              </Label>
              <Input
                id="relationShip"
                className="col-span-3"
                { ...register("relationShip") }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workPlace" className="text-right">
                Work place
              </Label>
              <Input id="workPlace"  className="col-span-3" { ...register("workplace") } />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="education" className="text-right">
                Educattion
              </Label>
              <Input id="education"  className="col-span-3" { ...register("education") } />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" className="col-span-3" { ...register("phone") } />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hometown" className="text-right">
                Hometown
              </Label>
              <Input id="hometown"  className="col-span-3" { ...register("hometown") } />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" /> { isSubmitting ? "Saving..." : "Save changes" }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditBio;
