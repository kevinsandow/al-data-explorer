import { Input } from "@mui/material";
import { useEffect, useState } from "react";

export function Search({ doSearch }: { doSearch: (search: string) => void; }) {
  const [search, setSearch] = useState("");
  const [changed, setChanged] = useState(false);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    console.log(value);
    setChanged(true);
    setSearch(value);
  };

  useEffect(() => {
    if (changed) {
      const timeOutId = setTimeout(() => doSearch(search), 500);
      return () => clearTimeout(timeOutId);
    }
  }, [search]);

  return <Input id="search" placeholder="Search" onChange={onSearch} autoComplete="off" />;
}
