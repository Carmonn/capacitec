import { ref } from "vue";

type DialogMode = "create" | "edit" | "delete";

export function useDialog<T>() {
  const dialogMode = ref<DialogMode>("create");
  const dialogControl = ref(false);
  const dialogItem = ref<T | null>(null);

  function setCreateDialog() {
    dialogItem.value = null;
    dialogMode.value = "create";
    dialogControl.value = true;
  }

  function setEditDialog() {
    dialogItem.value = null;
    dialogMode.value = "create";
    dialogControl.value = true;
  }

  function setDeleteDialog(itemSelected: T | null) {
    dialogItem.value = itemSelected;
    dialogMode.value = "delete";
    dialogControl.value = true;
  }

  return {
    dialogMode,
    dialogControl,
    dialogItem,
    setCreateDialog,
    setEditDialog,
    setDeleteDialog,
  };
}
