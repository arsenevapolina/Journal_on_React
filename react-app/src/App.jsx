import "./App.css";
import Header from "./components/Header/Header";
import JournalList from "./components/JournalList/JournalList";
import Body from "./layouts/Body/Body";
import LeftPanel from "./layouts/LeftPanel/LeftPanel";
import JournalAddButton from "./components/JournalAddButton/JournalAddButton";
import JournalForm from "./components/JournalForm/JournalForm";
import { useLocalStorage } from "./hooks/use-localstorage.hooks";
import { UserContextProvidev } from "./components/context/user.context";

function mapItems(items) {
  if (!items) {
    return [];
  }
  return items.map((i) => ({
    ...i,
    date: new Date(i.date),
  }));
}

function App() {
  const [items, setItems] = useLocalStorage("data");

  const addItem = (item) => {
    setItems([
      ...mapItems(items),
      {
        ...item,
        date: new Date(item.date),
        id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
      },
    ]);
  };

  return (
      <UserContextProvidev>
        <div className="app">
          <LeftPanel>
            <Header />
            <JournalAddButton />
            <JournalList items={mapItems(items)}></JournalList>
          </LeftPanel>
          <Body>
            <JournalForm onSubmit={addItem} />
          </Body>
        </div>
      </UserContextProvidev>
  );
}

export default App;
