import "./JournalForm.css";
import Button from "../Button/Button";
import { useState } from "react";

function JournalForm({ onSubmit }) {
  const [inputData, setInputData] = useState("");

  const addJournalItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    onSubmit(formProps);
  };

  const inputChange = (e) => {
    setInputData(e.target.value);
  };

  return (
    <form className="journal-form" onSubmit={addJournalItem}>
      <input type="text" name="title" />
      <input type="date" name="date" />
      <input type="text" name="tag" value={inputData} onChange={inputChange} />
      <textarea name="text" id="" cols="30" rows="10"></textarea>
      <Button type="submit" text="Сохранить" />
    </form>
  );
}

export default JournalForm;
