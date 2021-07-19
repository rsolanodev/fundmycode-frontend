<template>
    <div class="LayoutDefault">
        <nav-dynamic/>
        <main>
            <slot/>
        </main>
        <the-footer/>
    </div>
</template>

<script>
    import NavDynamic from "../components/navbar/NavDynamic";
    import TheFooter from "../components/Footer";

    export default {
        name: "layout-default",
        components: {NavDynamic, TheFooter}
    };
</script>
