<template>
    <nav>
        <router-link class="logo" to="/">
            <img class="miwied-logo" src="../assets/miwied_logo.svg" alt="miwied logo" />
        </router-link>
    </nav>
</template>

<style scoped>
nav {
    height: 2.7rem;
    padding: 0.1rem 0.5rem 0.1rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #2B2B2B;
}

.logo {
    height: 90%;
    height: 90%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    position: relative;
    pointer-events: auto;
    margin-right: 0.25rem;
}

.miwied-logo {
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>