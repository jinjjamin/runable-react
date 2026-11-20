import type { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import 'swiper/css';

// 가로 카드 슬라이드 (Swiper) — docs/design.md 2장, AGENTS.md 5.6
// - 카드 너비는 슬라이드 내용(renderItem)이 정하고(slidesPerView auto), 카드 사이 간격 12, 좌우 여백 24 (Figma 참여가능 레이스)
// - 키보드 포커스·화면 읽기용 안내는 Swiper A11y 모듈을 사용합니다.

interface SliderProps<T> {
    items: T[];
    getKey: (item: T) => string;
    renderItem: (item: T) => ReactNode;
    ariaLabel: string;
    spaceBetween?: number;
    sidePadding?: number;
}

const Slider = <T,>({ items, getKey, renderItem, ariaLabel, spaceBetween = 12, sidePadding = 24 }: SliderProps<T>) => {
    return (
        <div className="slider" role="region" aria-label={ariaLabel}>
            <Swiper
                modules={[A11y]}
                slidesPerView="auto"
                spaceBetween={spaceBetween}
                slidesOffsetBefore={sidePadding}
                slidesOffsetAfter={sidePadding}
                a11y={{ prevSlideMessage: '이전 카드', nextSlideMessage: '다음 카드', slideLabelMessage: '{{index}} / {{slidesLength}}' }}
            >
                {items.map((item) => (
                    <SwiperSlide key={getKey(item)} className="sliderSlide">
                        {renderItem(item)}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slider;
