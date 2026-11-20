import type { TermsBlock, TermsSection } from '../../../types';

// 약관·라이선스 본문 (Figma: CO 약관폼) — docs/design.md 2장, 6.0
// - 화면 제목(약관 타이틀)과 닫기는 페이지의 <Header type="close" />가 그립니다.
// - sections: 본문 타이틀(H4) + 설명 문단(B2 Gray-700) + 블록(서브 타이틀, 표, 목록)
// - 표 칸 안 줄바꿈은 문자열의 \n으로 넣습니다.

interface TermsFormProps {
    sections: TermsSection[];
}

const renderBlock = (block: TermsBlock, key: string) => {
    const { subTitle, table, list } = block;
    const ListTag = list?.type === 'number' ? 'ol' : 'ul';

    return (
        <div className="termsBlock" key={key}>
            {subTitle && <h3 className="termsSubTitle">{subTitle}</h3>}
            {table && (
                <table className={table.columns.length === 1 ? 'termsTable single' : 'termsTable'}>
                    <thead>
                        <tr>
                            {table.columns.map((column, index) => (
                                <th scope="col" key={`${column}-${index}`}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {list && (
                <ListTag className={`termsList ${list.type}`}>
                    {list.items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ListTag>
            )}
        </div>
    );
};

const TermsForm = ({ sections }: TermsFormProps) => {
    return (
        <div className="termsForm">
            {sections.map((section) => (
                <section className="termsSection" key={section.id} aria-labelledby={`${section.id}Title`}>
                    <div className="termsText">
                        <h2 className="termsTitle" id={`${section.id}Title`}>{section.title}</h2>
                        {section.paragraphs && (
                            <div className="termsParagraphs">
                                {section.paragraphs.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        )}
                    </div>
                    {section.blocks?.map((block, index) => renderBlock(block, `${section.id}Block${index}`))}
                </section>
            ))}
        </div>
    );
};

export default TermsForm;
