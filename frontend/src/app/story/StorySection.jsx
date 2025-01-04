"use client"

import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import StoryCard from './StoryCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { postStore } from '@/store/postStore';


function StorySection() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const containerRef = useRef()
  const { storys, fetchStory } = postStore();
  

  useEffect(() => {
    fetchStory()
  }, [fetchStory]);



  useEffect(() => {
    const container = containerRef.current;
    if (container) {
        const updateToMaxScroll = () => {
            setMaxScroll(container.scorllWidth - container.offsetWidth)
            setScrollPosition(container.scrollLeft)
        }; 

        updateToMaxScroll();
        window.addEventListener("resize", updateToMaxScroll);

        return () => window.removeEventListener("resize", updateToMaxScroll);
    }

  }, [storys])
  

  const scroll = (direction) => {
    const container = containerRef.current;
    if(container) {
        const scrollAmount = container === "left" ? -200 : +200
        container.scrollBy({left: scrollAmount, behavior: "smooth"})
    }
  };


  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
        setScrollPosition(container.scrollLeft)
    }
  };

  return (
    <div className='relative '>
      <div ref={containerRef} onScroll={handleScroll} className="flex space-x-2 overflow-x-hidden PY-24" style={{scorllWidth: "none", msOverflowStyle: "none"}}>

        <motion.div className='flex space-x-2' drag="x" dragConstraints={{right: 0, left: -(storys?.length + 1 * 200 ) + containerRef.current?.offsetWidth }} >
            <StoryCard isAddStory={true} />
            {storys?.map((story) => (
                <StoryCard story={story} key={story._id} />
            ))} 
        </motion.div>

        { scrollPosition > 0 && (
            <Button variant="outline" size="icon" className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out" onclick={() => scroll("left")}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
        ) }


{ scrollPosition < maxScroll && (
            <Button variant="outline" size="icon" className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out" onclick={() => scroll("right")}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        ) }

      </div>
    </div>
  )
}

export default StorySection
