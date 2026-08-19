import { useEffect, useState } from "react";
import api from "./api";

interface Card { id: string; title: string; }
interface Column { id: string; title: string; cards: Card[]; }
interface Board { id: string; title: string; columns: Column[]; }

interface Props { onLogout: () => void; }

export default function BoardView({ onLogout }: Props) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [active, setActive] = useState<Board | null>(null);
  const [newBoard, setNewBoard] = useState("");

  async function loadBoards() {
    const res = await api.get("/boards");
    setBoards(res.data);
    if (res.data.length && !active) setActive(res.data[0]);
  }

  useEffect(() => { loadBoards(); }, []);

  async function createBoard() {
    if (!newBoard.trim()) return;
    // Create the board, then re-fetch from the API so the new board
    // includes its columns WITH their (empty) cards arrays.
    const res = await api.post("/boards", { title: newBoard });
    setNewBoard("");
    const list = await api.get("/boards");
    setBoards(list.data);
    const created = list.data.find((b: Board) => b.id === res.data.id);
    setActive(created || list.data[0]);
  }

  async function addCard(columnId: string) {
    const title = prompt("Card title:");
    if (!title) return;
    await api.post(`/boards/columns/${columnId}/cards`, { title });
    refreshActive();
  }

  async function moveCard(cardId: string, columnId: string) {
    await api.patch(`/boards/cards/${cardId}`, { columnId });
    refreshActive();
  }

  async function deleteCard(cardId: string) {
    await api.delete(`/boards/cards/${cardId}`);
    refreshActive();
  }

  async function refreshActive() {
    const res = await api.get("/boards");
    setBoards(res.data);
    const updated = res.data.find((b: Board) => b.id === active?.id);
    if (updated) setActive(updated);
  }

  return (
    <div className="board-page">
      <header className="topbar">
        <h1 className="brand">TaskFlow</h1>
        <button className="logout" onClick={onLogout}>Log out</button>
      </header>

      <div className="board-controls">
        <select value={active?.id || ""} onChange={(e) => setActive(boards.find((b) => b.id === e.target.value) || null)}>
          {boards.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
        </select>
        <input placeholder="New board name" value={newBoard} onChange={(e) => setNewBoard(e.target.value)} />
        <button onClick={createBoard}>Add board</button>
      </div>

      {active && (
        <div className="columns">
          {active.columns.map((col) => (
            <div className="column" key={col.id}>
              <h3>{col.title} <span className="count">{col.cards.length}</span></h3>
              {col.cards.map((card) => (
                <div className="card" key={card.id}>
                  <span>{card.title}</span>
                  <div className="card-actions">
                    {active.columns.filter((c) => c.id !== col.id).map((c) => (
                      <button key={c.id} title={`Move to ${c.title}`} onClick={() => moveCard(card.id, c.id)}>
                        {c.title[0]}
                      </button>
                    ))}
                    <button className="del" onClick={() => deleteCard(card.id)}>x</button>
                  </div>
                </div>
              ))}
              <button className="add-card" onClick={() => addCard(col.id)}>+ Add card</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}