import styles from "./JournalForm.module.css";
import Button from "../Button/Button";
import cn from "classnames";
import { INITIAL_STATE, formReducer } from "./JournalForm.state";
import { useEffect, useReducer, useRef, useContext } from "react";
import Input from "../Input/Input";
import { UserContext } from "../context/user.context";

function JournalForm({ onSubmit }) {
  const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);

  const { isValid, isFormReadyToSubmit, values } = formState;

  const titleRef = useRef();
  const dateRef = useRef();
  const postRef = useRef();
  const { userId } = useContext(UserContext);

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

  useEffect(() => {
    dispatchForm({
      type: "SET_VALUE",
      payload: { userId }});
  }, [userId]);

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
      {userId}
      <div>
        <Input
          type="text"
          ref={titleRef}
          isValid={isValid.title}
          onChange={onChange}
          value={values.title}
          name="title"
          appearence="title"
        />
      </div>
      <div className={styles["form-row"]}>
        <label htmlFor="date" className={styles["form-label"]}>
          <img src="./public/calendar.svg" alt="Иконка календаря" />
          <span>Дата</span>
        </label>
        <Input
          type="date"
          ref={dateRef}
          isValid={isValid.date}
          onChange={onChange}
          name="date"
          value={values.date}
          id="date"
        />
      </div>
      <div className={styles["form-row"]}>
        <label htmlFor="tag" className={styles["form-label"]}>
          <img src="./public/folder.svg" alt="Иконка папки" />
          <span>Метки</span>
        </label>
        <Input
          type="text"
          onChange={onChange}
          name="tag"
          id="tag"
          value={values.tag}
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
