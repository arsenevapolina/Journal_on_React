import styles from "./JournalForm.module.css";
import Button from "../Button/Button";
import cn from "classnames";
import { INITIAL_STATE, formReducer } from "./JournalForm.state";
import { useEffect, useReducer, useRef } from "react";

function JournalForm({ onSubmit }) {
  const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);

  const { isValid, isFormReadyToSubmit, values } = formState;

  const titleRef = useRef();
  const dateRef = useRef();
  const postRef = useRef();

  const focusError = (isValid) => {
    switch (true) {
      case !isValid.title:
        titleRef.current.focus();
        break;
      case !isValid.date:
        dateRef.current.focus();
        break;
      case !isValid.post:
        postRef.current.focus();
        break;
    }
  };

  useEffect(() => {
    let timerId;
    if (!isValid.date || !isValid.post || !isValid.title) {
      focusError(isValid);
      timerId = setTimeout(() => {
        dispatchForm({ type: "RESET_VALIDITY" });
      }, 2000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [isValid]);

  useEffect(() => {
    if (isFormReadyToSubmit) {
      onSubmit(values);
      dispatchForm({ type: "CLEAR" });
    }
  }, [isFormReadyToSubmit, values, onSubmit]);

  const onChange = (e) => {
    dispatchForm({
      type: "SET_VALUE",
      payload: { [e.target.name]: e.target.value },
    });
  };

  const addJournalItem = (e) => {
    e.preventDefault();
    dispatchForm({ type: "SUBMIT" });
  };

  return (
    <form className={styles["journal-form"]} onSubmit={addJournalItem}>
      <div>
        <input
          type="text"
          ref={titleRef}
          onChange={onChange}
          value={values.title}
          name="title"
          className={cn(styles["input-title"], {
            [styles["invalid"]]: !isValid.title,
          })}
        />
      </div>
      <div className={styles["form-row"]}>
        <label htmlFor="date" className={styles["form-label"]}>
          <img src="./public/calendar.svg" alt="Иконка календаря" />
          <span>Дата</span>
        </label>
        <input
          type="date"
          ref={dateRef}
          onChange={onChange}
          name="date"
          value={values.date}
          id="date"
          className={cn(styles["input"], {
            [styles["invalid"]]: !isValid.date,
          })}
        />
      </div>
      <div className={styles["form-row"]}>
        <label htmlFor="tag" className={styles["form-label"]}>
          <img src="./public/folder.svg" alt="Иконка папки" />
          <span>Метки</span>
        </label>
        <input
          type="text"
          onChange={onChange}
          name="tag"
          id="tag"
          value={values.tag}
          className={styles["input"]}
        />
      </div>
      <textarea
        ref={postRef}
        name="post"
        id="post"
        onChange={onChange}
        value={values.post}
        cols="30"
        rows="10"
        className={cn(styles["input"], {
          [styles["invalid"]]: !isValid.post,
        })}
      ></textarea>
      <Button type="submit" text="Сохранить" />
    </form>
  );
}

export default JournalForm;
