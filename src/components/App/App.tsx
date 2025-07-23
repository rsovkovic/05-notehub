import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  useQuery,
  keepPreviousData,
  // useMutation,
  // useQueryClient,
} from "@tanstack/react-query";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import { fetchNotes } from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyMessage from "../Empty/EmptyMessage";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () =>
      fetchNotes({ page: currentPage, perPage: 12, search: searchQuery }),
    enabled: true,
    placeholderData: keepPreviousData,
  });
  const updateSearchQuery = useDebouncedCallback(
    (value: string) => setSearchQuery(value),
    300
  );
  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    updateSearchQuery(value);
  };
  // const queryClient = useQueryClient();
  // const deleteMutation = useMutation<void, Error, number>({
  //   mutationFn: (id: number) => deleteNote(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["notes"] });
  //   },
  // });
  // const handleDelete = (id: number) => {
  //   deleteMutation.mutate(id);
  // };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const totalPages = data?.totalPages ?? 0;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={handleOpen}>
          Create note +
        </button>
        {isModalOpen && (
          <Modal onClose={handleClose}>
            <NoteForm onClose={handleClose} />
          </Modal>
        )}
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.notes.length === 0 && <EmptyMessage />}
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
