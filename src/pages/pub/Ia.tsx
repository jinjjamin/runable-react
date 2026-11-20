import { useMemo, useState } from 'react';
import type { FormEvent, SyntheticEvent } from 'react';
import { IA_INFO, IA_TABLES, TASKS } from '../../data/iaData';
import type { Cell, TaskKey } from '../../types';
import '../../assets/css/ia.css';

// IA 관리 화면 (/ia) — AGENTS.md 6.3 기준
// - 마크업·표시 문구·동작은 원본 Ia.tsx와 동일하게 유지합니다.
// - 원본의 <style> 태그와 전역 style 제거 useEffect는 사용하지 않고, 스타일은 ia.css의 #iaWrap 범위에 있습니다.
// - 공통 Header·Footer·Layout을 적용하지 않는 독립 화면입니다.

const hasClass = (cell: Cell, className: string) => cell.className.split(' ').includes(className);

const getTaskKey = (row: Cell[]): TaskKey => {
    const task = row.find((cell) => hasClass(cell, 'checkTask'))?.text;
    return TASKS.some((item) => item.key === task) ? (task as TaskKey) : '0';
};

const getTaskName = (key: TaskKey) => TASKS.find((task) => task.key === key)?.name ?? 'Undone';

const getFileHref = (path: string, row: Cell[]) => {
    const fileName = row.find((cell) => hasClass(cell, 'fileName'))?.text ?? '';
    const filePath = row.find((cell) => hasClass(cell, 'filePath'))?.text ?? '';
    return [path.replace(/\/$/, ''), filePath.replace(/^\/|\/$/g, ''), fileName].filter(Boolean).join('/');
};

const getDueDateClass = (date: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'delayError';
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayText = `${yyyy}-${mm}-${dd}`;
    if (date > todayText) return 'delayBefore';
    if (date < todayText) return 'delayAfter';
    return 'delayToday';
};

const countTasks = (rows: Cell[][]) => {
    const counts = Object.fromEntries(TASKS.map((task) => [task.key, 0])) as Record<TaskKey, number>;
    rows.forEach((row) => counts[getTaskKey(row)]++);
    return counts;
};

const Ia = () => {
    const [selectedTasks, setSelectedTasks] = useState<TaskKey[]>(TASKS.map((task) => task.key));
    const [previewUrl, setPreviewUrl] = useState('');

    const allChecked = selectedTasks.length === TASKS.length;

    const totalCounts = useMemo(() => countTasks(IA_TABLES.flatMap((table) => table.rows)), []);

    const handleToggleAll = () => setSelectedTasks(allChecked ? [] : TASKS.map((task) => task.key));

    const handleToggleTask = (key: TaskKey) => {
        setSelectedTasks((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
    };

    const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    // 미리보기 iframe 내부 #wrap 축소: 동일 출처이고 #wrap이 있는 페이지에서만 동작합니다.
    const handlePreviewLoad = (event: SyntheticEvent<HTMLIFrameElement>) => {
        try {
            const wrap = event.currentTarget.contentDocument?.querySelector<HTMLElement>('#wrap');
            if (wrap) {
                wrap.style.transform = 'scale(0.16923076923076924)';
                wrap.style.transformOrigin = '0 0';
            }
        } catch {
            // 다른 origin의 페이지는 iframe 내부 DOM에 접근할 수 없습니다.
        }
    };

    return (
        <div id="iaWrap">
            <header>
                <h1><em>{IA_INFO.title}</em>, Front-end Web developer Worksheet</h1>
            </header>

            <nav>
                <h2>Navigation</h2>
                <ul>
                    {IA_TABLES.map((table) => (
                        <li key={table.id}><a href={`#${table.id}`}>{table.title}</a></li>
                    ))}
                </ul>
            </nav>

            <section className="noticeWrap">
                <h2>Notice</h2>
                <ul>
                    <li>{IA_INFO.notice}</li>
                </ul>
            </section>

            <footer>
                <h2>Total Count</h2>
                <table>
                    <caption>Task total count</caption>
                    <thead>
                        <tr>
                            <th scope="col">Menu</th>
                            {TASKS.map((task) => (
                                <th scope="col" key={task.key}><i>{task.name}</i><b>{task.key}</b></th>
                            ))}
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {IA_TABLES.map((table) => {
                            const counts = countTasks(table.rows);
                            return (
                                <tr key={table.id}>
                                    <th scope="row">{table.title}</th>
                                    {TASKS.map((task) => <td key={task.key}>{counts[task.key]}</td>)}
                                    <td>{table.rows.length}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row">Total</th>
                            {TASKS.map((task) => <td key={task.key}>{totalCounts[task.key]}</td>)}
                            <td>{IA_TABLES.reduce((sum, table) => sum + table.rows.length, 0)}</td>
                        </tr>
                    </tfoot>
                </table>
            </footer>

            <section className="filterWrap">
                <h2>Task Key/Filter</h2>
                <form onSubmit={handleFilterSubmit}>
                    <fieldset>
                        <legend>Filter option(It&apos;ll be automatically applied)</legend>
                        <label><input type="checkbox" checked={allChecked} onChange={handleToggleAll} />All</label>
                        {TASKS.map((task) => (
                            <label key={task.key}>
                                <input
                                    type="checkbox"
                                    checked={selectedTasks.includes(task.key)}
                                    onChange={() => handleToggleTask(task.key)}
                                />
                                <b className={task.key === '0' ? 'default' : undefined}>{task.key}</b><i>{task.name}</i>
                            </label>
                        ))}
                    </fieldset>
                </form>
            </section>

            <section>
                <h2>{IA_INFO.worksheet}</h2>
                {IA_TABLES.map((table) => {
                    const visibleRows = table.rows.filter((row) => selectedTasks.includes(getTaskKey(row)));
                    const tableCounts = countTasks(table.rows);

                    return (
                        <div key={table.id}>
                            <h3 id={table.id} className="menuTitle">{table.title}</h3>
                            <table>
                                <caption>{table.path}</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" className="pageNumber">Number</th>
                                        {table.headers.map((header, index) => (
                                            <th scope="col" className={header.className || undefined} key={`${header.text}-${index}`}>
                                                {header.text}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleRows.map((row) => {
                                        const originalIndex = table.rows.indexOf(row);
                                        const taskKey = getTaskKey(row);
                                        return (
                                            <tr key={`${table.id}-${originalIndex}`}>
                                                <td className="pageNumber">{originalIndex + 1}</td>
                                                {row.map((cell, cellIndex) => {
                                                    const isFileName = hasClass(cell, 'fileName');
                                                    const isTask = hasClass(cell, 'checkTask');
                                                    const isDueDate = hasClass(cell, 'dueDate');
                                                    const className = [cell.className, isDueDate ? getDueDateClass(cell.text) : '']
                                                        .filter(Boolean)
                                                        .join(' ');
                                                    const href = isFileName && cell.text ? getFileHref(table.path, row) : '';
                                                    return (
                                                        <td className={className} data-task={isTask ? taskKey : undefined} key={cellIndex}>
                                                            {isFileName && cell.text ? (
                                                                <a
                                                                    href={href}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    onMouseEnter={() => setPreviewUrl(href)}
                                                                    onMouseLeave={() => setPreviewUrl('')}
                                                                >
                                                                    {cell.text}
                                                                </a>
                                                            ) : isTask ? getTaskName(taskKey) : cell.text}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    {TASKS.map((task) => (
                                        <tr key={task.key}>
                                            <th scope="row" colSpan={table.headers.length}><i>{task.name}</i><b>{task.key}</b></th>
                                            <td>{tableCounts[task.key]}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th scope="row" colSpan={table.headers.length}>Total</th>
                                        <td>{table.rows.length}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    );
                })}
            </section>

            {previewUrl && (
                <iframe className="previewIframe" src={previewUrl} title="페이지 미리보기" onLoad={handlePreviewLoad} />
            )}
        </div>
    );
};

export default Ia;
