import React, { FC } from "react";
import { Modal, Box } from "@mui/material";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: any;
  setRoute?: (route: string) => void;
  refetch?: any;
}

const CustomModal: FC<Props> = ({
  open,
  setOpen,
  setRoute,
  component: Component,
  refetch,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center p-4"
    >
      <Box className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 sm:p-6 outline-none animate-fade-in border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch} />
      </Box>
    </Modal>
  );
};

export default CustomModal;
